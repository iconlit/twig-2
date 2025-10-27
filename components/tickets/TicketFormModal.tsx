import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus } from '../../types';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface TicketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  ticket: Ticket | null;
}

const TicketFormModal: React.FC<TicketFormModalProps> = ({ isOpen, onClose, onSubmit, ticket }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TicketStatus>(TicketStatus.Open);
  const [errors, setErrors] = useState<{ title?: string; status?: string }>({});

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title);
      setDescription(ticket.description || '');
      setStatus(ticket.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus(TicketStatus.Open);
    }
    setErrors({});
  }, [ticket, isOpen]);

  const validate = () => {
    const newErrors: { title?: string; status?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!Object.values(TicketStatus).includes(status)) newErrors.status = 'Invalid status.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title, description, status });
  };

  const statusOptions = [
    { value: TicketStatus.Open, label: 'Open' },
    { value: TicketStatus.InProgress, label: 'In Progress' },
    { value: TicketStatus.Closed, label: 'Closed' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={ticket ? 'Edit Ticket' : 'Create Ticket'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          required
        />
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 border px-3 py-2"
            />
        </div>
        <Select
          id="status"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TicketStatus)}
          error={errors.status}
          options={statusOptions}
          required
        />
        <div className="pt-4 flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">{ticket ? 'Save Changes' : 'Create Ticket'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TicketFormModal;