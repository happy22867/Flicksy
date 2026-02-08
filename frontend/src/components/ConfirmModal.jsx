import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, confirmLabel = 'OK', cancelLabel = 'Cancel', onConfirm, onCancel, danger = true }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="confirm-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="confirm-modal"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="confirm-modal-title">{title}</h3>
          <p className="confirm-modal-message">{message}</p>
          <div className="confirm-modal-actions">
            <button type="button" className="confirm-btn cancel" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button
              type="button"
              className={`confirm-btn ${danger ? 'danger' : 'primary'}`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
