
import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ticketTitle: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, ticketTitle }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="text-gray-700 dark:text-gray-300">
        <p>Are you sure you want to delete the ticket titled "{ticketTitle}"?</p>
        <p className="mt-2 font-semibold">This action cannot be undone.</p>
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
