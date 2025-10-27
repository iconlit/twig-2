
import { User } from '../types';

const SESSION_KEY = 'ticketapp_session';

interface Session {
  user: User;
  token: string;
}

export const setSession = (session: Session): void => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session to localStorage', error);
  }
};

export const getSession = (): Session | null => {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  } catch (error) {
    console.error('Error getting session from localStorage', error);
    return null;
  }
};

export const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session from localStorage', error);
  }
};
