import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiChevronUp } from "react-icons/fi";
import { useLocation } from "react-router";
import Hero from "./shared/Hero";
import BestWorker from "./shared/BestWorker";
import TestimonialSection from "./shared/TestimonialSection";
import { usePageTitle } from "../../hooks/usePageTitle";
import useUserRole from "./../../hooks/userUserRole";
import HowItWorks from "./shared/HowItWorks";
import WhyChoose from "./shared/WhyChoose";
import Extra from "./shared/Extra";

const Home = () => {
  const { userInfo } = useUserRole();
  const role = userInfo?.role || "guest";
  usePageTitle("Home", {
    suffix: " | EarnSphereX",
    maxLength: 60,
  });
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [showScrollButton, setShowScrollButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="overflow-hidden">
      {/* Existing Sections */}
      <section>
        <Hero />
      </section>

      <section className="my-10">
        <HowItWorks role={role} />
      </section>
      <section>
        <BestWorker />
      </section>

      <section className="my-10">
        <WhyChoose />
      </section>
      <section>
        <TestimonialSection />
      </section>

      <section>
        <Extra role={role} className="my-10"/>
      </section>

      

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-50 p-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-colors"
          aria-label="Scroll to top"
        >
          <FiChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};

export default Home;
