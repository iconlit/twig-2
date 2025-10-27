import { Ticket, TicketStatus } from '../types';

const TICKETS_KEY = 'ticketapp_tickets';

// --- Mock Database ---
const getTicketsFromStorage = (): Ticket[] => {
  const data = localStorage.getItem(TICKETS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveTicketsToStorage = (tickets: Ticket[]) => {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
};

// Seed initial data if none exists
if (!localStorage.getItem(TICKETS_KEY)) {
  saveTicketsToStorage([]);
}

// --- Mock API Functions ---
const simulateApiCall = <T,>(data: T, delay = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const getTickets = async (): Promise<Ticket[]> => {
  const tickets = getTicketsFromStorage();
  return simulateApiCall(tickets);
};

export const createTicket = async (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> => {
  const tickets = getTicketsFromStorage();
  const newTicket: Ticket = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updatedTickets = [...tickets, newTicket];
  saveTicketsToStorage(updatedTickets);
  return simulateApiCall(newTicket);
};

export const updateTicket = async (id: string, data: Partial<Omit<Ticket, 'id'>>): Promise<Ticket> => {
  let tickets = getTicketsFromStorage();
  const ticketIndex = tickets.findIndex(t => t.id === id);
  if (ticketIndex === -1) {
    throw new Error('Ticket not found');
  }
  const updatedTicket = { ...tickets[ticketIndex], ...data, updatedAt: new Date().toISOString() };
  tickets[ticketIndex] = updatedTicket;
  saveTicketsToStorage(tickets);
  return simulateApiCall(updatedTicket);
};

export const deleteTicket = async (id: string): Promise<{ id: string }> => {
  let tickets = getTicketsFromStorage();
  const updatedTickets = tickets.filter(t => t.id !== id);
  if (tickets.length === updatedTickets.length) {
    throw new Error('Ticket not found');
  }
  saveTicketsToStorage(updatedTickets);
  return simulateApiCall({ id });
};