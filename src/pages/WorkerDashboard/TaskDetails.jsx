import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { CalendarDays, User, DollarSign, Users, ClipboardList, ImageIcon } from 'lucide-react';
import useAxiosSecure from './../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import axios from 'axios';

const TaskDetails = () => {
  usePageTitle('Task Details', {
    suffix: ' | EarnSphereX',
    maxLength: 60
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch task details
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks/work/${id}`);
      return res.data;
    }
  });

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", `${import.meta.env.VITE_upload_preset}`);
      formData.append("cloud_name", `${import.meta.env.VITE_cloud_name}`);

      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_cloud_name}/image/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Mutation for submitting task
  const { mutate: submitTask, isPending } = useMutation({
    mutationFn: async (submissionData) => {
      const submission = {
        task_id: task._id,
        task_title: task.task_title,
        payable_amount: parseInt(task.payable_amount),
        worker_email: user.email,
        worker_name: user.displayName,
        submission_details: submissionData.submission_details,
        submission_image: imageUrl, // Add image URL to submission
        Buyer_name: task.buyer_name,
        Buyer_email: task.created_by,
        current_date: new Date().toISOString(),
        status: 'pending'
      };
      const res = await axiosSecure.post('/task-submissions', submission);
      return res.data;
    },
    onSuccess: () => {
      reset();
      setImageUrl(null);
      navigate('/dashboard/my-submission');
    }
  });
  
  const onSubmit = (data) => {
    submitTask(data);
  };

  if (isLoading) return <div className="text-center py-8"><span className="loading loading-spinner loading-lg text-emerald-500"></span></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-sm btn-ghost text-teal-600 mb-4"
        >
          ← Back to Tasks
        </button>
        
        <div className="card bg-white shadow-lg rounded-lg overflow-hidden border border-teal-100">
          <figure>
            <img src={task.task_image_url} alt={task.task_title} className="w-full h-64 object-cover" />
          </figure>
          
          <div className="card-body p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{task.task_title}</h1>
            <p className="text-gray-600 mb-6">{task.task_detail}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                <User className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500">Buyer</p>
                  <p className="font-medium">{task.created_by.split('@')[0]}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500">Payable Amount</p>
                  <p className="font-medium">${task.payable_amount}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                <CalendarDays className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500">Completion Date</p>
                  <p className="font-medium">{task.completion_date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                <Users className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500">Workers Needed</p>
                  <p className="font-medium">{task.required_workers}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-teal-600" />
                Submission Requirements
              </h3>
              <p className="text-gray-600">{task.submission_info}</p>
            </div>
            
            <div className="divider"></div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Submit Your Work</h3>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-gray-600">Submission Details</span>
                </label>
                <textarea 
                  {...register("submission_details", { required: true })}
                  className="textarea textarea-bordered h-32 focus:border-teal-500 focus:ring-1 focus:ring-teal-500" 
                  placeholder="Provide your submission details as requested..."
                ></textarea>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-gray-600 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Screenshot/Proof (Optional)
                  </span>
                </label>
                <input 
                  type="file" 
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered w-full"
                  accept="image/*"
                />
                {isUploading && <span className="text-sm text-gray-500 mt-2">Uploading image...</span>}
                {imageUrl && (
                  <div className="mt-2">
                    <img src={imageUrl} alt="Preview" className="h-32 rounded-md" />
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="btn bg-teal-500 hover:bg-teal-600 text-white"
                disabled={isPending || isUploading}
              >
                {isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : 'Submit Task'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;