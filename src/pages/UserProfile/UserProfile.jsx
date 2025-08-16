import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit, FiSave, FiUpload } from "react-icons/fi";
import { usePageTitle } from "../../hooks/usePageTitle";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const UserProfile = () => {
  usePageTitle("My Profile", {
    suffix: " | EarnSphereX",
    maxLength: 60,
  });
  const {user : userProfile} = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    photoURL: "",
    bio: "",
    skills: "",
  });

  // Get user data
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${userProfile?.email}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        photoURL: user.photoURL || "",
        bio: user.bio || "",
        skills: user.skills ? user.skills.join(", ") : "",
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (updatedData) =>
      axiosSecure.patch(`/usersprofile/${userProfile?.email}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully",
        icon: "success",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update profile",
        icon: "error",
      });
    },
  });

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", `${import.meta.env.VITE_upload_preset}`);
      formData.append("cloud_name", `${import.meta.env.VITE_cloud_name}`);

      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloud_name}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileData({ ...profileData, photoURL: data.secure_url });
    } catch (error) {
      Swal.fire({
        title: "Image Upload Failed",
        text: error.response?.data?.message || error.message,
        icon: "error",
      });
      console.error("Upload error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    // e.preventDefault();
    const updatedData = {
      ...profileData,
      skills: profileData.skills.split(",").map(skill => skill.trim()),
    };
    updateMutation.mutate(updatedData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture Section */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={profileData.photoURL || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-teal-100"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer p-2 bg-teal-500 text-white rounded-full">
                      <FiUpload className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              {loading && (
                <div className="text-center mt-2 text-teal-600">Uploading...</div>
              )}
            </div>

            {/* Profile Info Section */}
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className="border-b border-teal-500 focus:outline-none"
                    />
                  ) : (
                    user?.name
                  )}
                </h2>
                <button
                  onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <FiSave className="w-4 h-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <FiEdit className="w-4 h-4" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Email</h3>
                  <p className="text-gray-700">{user?.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Role</h3>
                  <p className="text-gray-700 capitalize">{user?.role}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Bio</h3>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      className="w-full border border-teal-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {user?.bio || "No bio added yet"}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Skills</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      name="skills"
                      value={profileData.skills}
                      onChange={handleChange}
                      placeholder="Comma separated skills"
                      className="w-full border border-teal-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user?.skills?.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No skills added yet</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Member Since</h3>
                  <p className="text-gray-700">
                    {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;