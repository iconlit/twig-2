
export enum TicketStatus {
  Open = 'open',
  InProgress = 'in_progress',
  Closed = 'closed',
}

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error';
};

export interface ToastContextType {
  addToast: (message: string, type: 'success' | 'error') => void;
}
