import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmAlert = ({ show, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <Modal 
      show={show} 
      onHide={onCancel} 
      centered 
      contentClassName="rounded-modal border-0 overflow-hidden shadow-lg"
    >
      <Modal.Header 
        closeButton 
        style={{ backgroundColor: "#071018", borderBottom: "1px solid #1a2838" }} 
        className="modal-header-custom border-0 text-white"
      >
        <Modal.Title className="text-white font-weight-bold">
          <i className='fas fa-exclamation-triangle text-warning mr-2'></i> {title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ backgroundColor: "#0b1521" }} className="text-white p-4 text-center">
        <p className='text-muted mb-4' style={{ fontSize: '1.1rem' }}>
          {message}
        </p>
        
        <div className="d-flex justify-content-center mt-2">
          <Button 
            variant="outline-secondary" 
            className="mr-3 rounded-pill px-4"
            style={{ fontWeight: "bold" }}
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button 
            variant="danger" 
            className="rounded-pill px-4 shadow-sm"
            style={{ 
              fontWeight: "bold",
              background: 'linear-gradient(45deg, #ef4444, #dc2626)',
              border: 'none'
            }}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmAlert;
