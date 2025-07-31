import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { Quote, Star, User } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/autoplay'; 

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Freelance Designer",
    quote:
      "EarnSphereX helped me find consistent work and get paid faster than any other platform I've used.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Small Business Owner",
    quote:
      "The quality of work I've received from workers here has been exceptional. It's transformed my business.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Content Creator",
    quote:
      "I've doubled my income since joining. The community and support are amazing!",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 4,
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Startup Founder",
    quote:
      "Finding reliable talent was always hard until I discovered EarnSphereX. Game changer!",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    rating: 5,
  },
  {
    id: 5,
    name: "Jennifer Lee",
    role: "Digital Marketer",
    quote:
      "As a buyer, I get tasks completed 3x faster here than other platforms. Worth every coin!",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    rating: 5,
  },
  {
    id: 6,
    name: "Carlos Mendez",
    role: "Graphic Designer",
    quote:
      "Withdrew my first $500 last month. This platform actually delivers on its promises.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5,
  },
  {
    id: 7,
    name: "Aisha Khan",
    role: "E-commerce Seller",
    quote:
      "The verification system ensures I only get quality submissions. Saves me so much time!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 4,
  },
  {
    id: 8,
    name: "James Peterson",
    role: "Social Media Manager",
    quote:
      "Earned enough to pay my rent just doing micro-tasks in my spare time. Incredible!",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    rating: 5,
  },
  {
    id: 9,
    name: "Olivia Smith",
    role: "Blogger",
    quote:
      "Customer support actually responds within hours. Rare to find this level of service.",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    rating: 5,
  },
  {
    id: 10,
    name: "Raj Patel",
    role: "App Developer",
    quote:
      "The withdrawal process is seamless. Got my money in 2 days with no hassles.",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 5,
  },
  {
    id: 11,
    name: "Sophia Garcia",
    role: "Virtual Assistant",
    quote:
      "Finally a platform that values workers' time fairly. The rates are much better here.",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    rating: 4,
  },
  {
    id: 12,
    name: "Thomas Wright",
    role: "Startup CEO",
    quote:
      "Scaled my business using EarnSphereX workers. Now have a dedicated team of 10 regulars.",
    avatar: "https://randomuser.me/api/portraits/men/60.jpg",
    rating: 5,
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="container mx-auto text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          What Our <span className="text-teal-600">Users</span> Say
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Hear from our community of satisfied buyers and skilled workers
        </p>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: ".swiper-pagination", // Custom pagination container
            bulletClass: "swiper-pagination-bullet", // Custom bullet class
            bulletActiveClass: "swiper-pagination-bullet-active", // Active bullet class
          }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-20" 
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col"
              >
                {/* Rating Stars - Fixed Height */}
                <div className="flex justify-center mb-4 h-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "fill-emerald-500 text-emerald-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="h-10 flex items-center justify-center mb-2">
                  <Quote className="w-8 h-8 text-teal-500" />
                </div>

                <div className="min-h-[120px] max-h-[120px] overflow-y-auto mb-6 px-2">
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-center gap-4 h-[72px]">
                    <div className="avatar flex-shrink-0">
                      <div className="w-14 rounded-full ring-2 ring-teal-500 ring-offset-2">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://i.ibb.co/qM7xWkkZ/admin.jpg";
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="font-bold text-gray-800 truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination mt-8 !relative !bottom-0"></div>
        </Swiper>
      </motion.div>
    </section>
  );
};

export default TestimonialSection;
