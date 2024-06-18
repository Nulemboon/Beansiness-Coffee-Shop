import React from 'react';
import './ConfirmCancelModal.css'; 

const ConfirmCancelModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-cancel-modal-overlay" onClick={onClose}>
      <div className="confirm-cancel-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Cancellation</h2>
        <p>Are you sure you want to cancel this order?</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-button">Yes, Cancel</button>
          <button onClick={onClose} className="cancel-button">No, Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCancelModal;
