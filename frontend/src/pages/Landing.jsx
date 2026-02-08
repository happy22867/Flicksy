import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaUsers, FaShare, FaShieldAlt, FaBolt, FaPlay, FaUserPlus } from 'react-icons/fa';
import '../styles/Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      title: "Welcome to Flincky",
      subtitle: "Connect, Share, and Discover Amazing Moments",
      features: [
        { icon: FaHeart, text: "Share Moments" },
        { icon: FaUsers, text: "Connect" },
        { icon: FaComment, text: "Engage" }
      ],
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f687b3 50%, #fbb6ce 75%, #ffd89b 100%)"
    },
    {
      id: 1,
      title: "Share Your Story",
      subtitle: "Express Yourself with Posts, Photos, and More",
      features: [
        { icon: FaShare, text: "Share Content" },
        { icon: FaHeart, text: "Get Likes" },
        { icon: FaComment, text: "Start Conversations" }
      ],
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 2,
      title: "Join the Community",
      subtitle: "Safe, Fast, and Fun Social Experience",
      features: [
        { icon: FaShieldAlt, text: "Stay Safe" },
        { icon: FaBolt, text: "Lightning Fast" },
        { icon: FaUsers, text: "Growing Community" }
      ],
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="landing-container" style={{ background: currentSlideData.bgGradient }}>
      <div className="animated-background">
        {[...Array(30)].map((_, i) => (
          <motion.div key={i} className="floating-particle" initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0 }} animate={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: [0, 1, 0] }} transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentSlide} className="landing-content" custom={currentSlide === 0 ? -1 : 1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}>
          <motion.div className="logo-container" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <motion.div className="logo-icon" whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.95 }}>✨</motion.div>
          </motion.div>
          
          <motion.h1 className="landing-title" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
            {currentSlideData.title}
          </motion.h1>
          
          <motion.p className="landing-subtitle" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
            {currentSlideData.subtitle}
          </motion.p>

          <motion.div className="landing-features">
            {currentSlideData.features.map((feature, index) => (
              <motion.div key={index} className="feature-item" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}>
                <feature.icon className="feature-icon" />
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="landing-buttons" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 1.0 }}>
            <motion.button className="btn btn-primary" onClick={() => navigate('/login')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <FaPlay style={{ marginRight: '8px' }} />Get Started
            </motion.button>
            <motion.button className="btn btn-secondary" onClick={() => navigate('/signup')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <FaUserPlus style={{ marginRight: '8px' }} />Create Account
            </motion.button>
          </motion.div>

          <div className="slide-indicators">
            {slides.map((_, index) => (
              <button key={index} className={`slide-dot ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Landing;
