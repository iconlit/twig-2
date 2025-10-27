
import React from 'react';
import { TicketStatus } from '../../types';

interface StatusTagProps {
  status: TicketStatus;
}

const statusStyles: Record<TicketStatus, { bg: string; text: string; label: string }> = {
  [TicketStatus.Open]: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', label: 'Open' },
  [TicketStatus.InProgress]: { bg: 'bg-amber-100 dark:bg-amber-900', text: 'text-amber-800 dark:text-amber-200', label: 'In Progress' },
  [TicketStatus.Closed]: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', label: 'Closed' },
};

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const styles = statusStyles[status];
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles.bg} ${styles.text}`}>
      {styles.label}
    </span>
  );
};

export default StatusTag;
