
import React from 'react';
import { Ticket } from '../../types';
import Card from '../ui/Card';
import StatusTag from '../ui/StatusTag';

interface TicketCardProps {
  ticket: Ticket;
  onEdit: () => void;
  onDelete: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onEdit, onDelete }) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{ticket.title}</h3>
          <StatusTag status={ticket.status} />
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {ticket.description || 'No description provided.'}
        </p>
      </div>
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end space-x-2">
        <button onClick={onEdit} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
          Edit
        </button>
        <button onClick={onDelete} className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
          Delete
        </button>
      </div>
    </Card>
  );
};

export default TicketCard;
