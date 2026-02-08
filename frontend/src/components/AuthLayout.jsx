import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Auth.css';

const SLIDES = [
  {
    title: 'Share your moments',
    subtitle: 'Post photos and updates with your community',
    icon: '📸',
  },
  {
    title: 'Connect with others',
    subtitle: 'Like, comment and discover what friends are up to',
    icon: '💬',
  },
  {
    title: 'Your space, your style',
    subtitle: 'Build your profile and express yourself',
    icon: '✨',
  },
];

const AuthLayout = ({ children, title }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [skipped, setSkipped] = useState(false);

  const handleSkip = () => setSkipped(true);
  const nextSlide = () => setSlideIndex((i) => (i + 1) % SLIDES.length);

  return (
    <div className="auth-container">
      <AnimatePresence mode="wait">
        {!skipped ? (
          <motion.div
            key="with-slider"
            className="auth-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.4 }}
          >
            <div className="auth-slider-panel">
              <button type="button" className="auth-skip-btn" onClick={handleSkip}>
                Skip
              </button>
              <div className="auth-slider-content">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35 }}
                    className="auth-slide"
                  >
                    <span className="auth-slide-icon">{SLIDES[slideIndex].icon}</span>
                    <h3 className="auth-slide-title">{SLIDES[slideIndex].title}</h3>
                    <p className="auth-slide-subtitle">{SLIDES[slideIndex].subtitle}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="auth-slider-dots">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`auth-dot ${i === slideIndex ? 'active' : ''}`}
                    onClick={() => setSlideIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <button type="button" className="auth-slider-next" onClick={nextSlide}>
                Next
              </button>
            </div>
            <motion.div
              className="auth-form-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              {children}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form-only"
            className="auth-form-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthLayout;
