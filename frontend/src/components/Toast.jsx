import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Toast.css';

export const Toast = ({ toasts, onDismiss }) => {
  return (
    <div className="toast-container" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className="toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <span className="toast-emoji">{t.emoji || '✓'}</span>
            <span className="toast-message">{t.message}</span>
            {onDismiss && (
              <button type="button" className="toast-dismiss" onClick={() => onDismiss(t.id)} aria-label="Dismiss">
                ×
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
