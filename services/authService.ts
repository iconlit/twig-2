import { User } from '../types';

const USERS_KEY = 'ticketapp_users';

// --- Mock User Database ---
const getUsersFromStorage = (): (User & { passwordHash: string })[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveUsersToStorage = (users: (User & { passwordHash: string })[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Seed initial data if none exists
if (!localStorage.getItem(USERS_KEY)) {
  const initialUsers: (User & { passwordHash: string })[] = [
    { id: '1', email: 'test@example.com', passwordHash: 'password123' }, // In a real app, hash passwords!
  ];
  saveUsersToStorage(initialUsers);
}

// --- Mock API Functions ---
const simulateApiCall = <T,>(data: T, delay = 500): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
};
  
// A very simple mock JWT generator/validator
const createToken = (user: User): string => `mock-token-for-user-id-${user.id}`;
const getUserIdFromToken = (token: string): string | null => {
    const match = token.match(/^mock-token-for-user-id-(.*)$/);
    return match ? match[1] : null;
}


export const signupUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  await simulateApiCall(null, 200); // simulate network latency
  const users = getUsersFromStorage();
  if (users.some(u => u.email === email)) {
    throw new Error('User with this email already exists.');
  }

  const newUser: User & { passwordHash:string } = {
    id: Date.now().toString(),
    email,
    passwordHash: password, // Not hashing for this mock.
  };

  saveUsersToStorage([...users, newUser]);

  const { passwordHash, ...userToReturn } = newUser;
  const token = createToken(userToReturn);
  
  return { user: userToReturn, token };
};

export const loginUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  await simulateApiCall(null, 200); // simulate network latency
  const users = getUsersFromStorage();
  const foundUser = users.find(u => u.email === email);

  if (!foundUser || foundUser.passwordHash !== password) {
    throw new Error('Invalid email or password.');
  }
  
  const { passwordHash, ...userToReturn } = foundUser;
  const token = createToken(userToReturn);

  return { user: userToReturn, token };
};


export const validateSession = async (token: string): Promise<User | null> => {
    const userId = getUserIdFromToken(token);
    if (!userId) {
        return simulateApiCall(null);
    }

    const users = getUsersFromStorage();
    const foundUser = users.find(u => u.id === userId);

    if (!foundUser) {
        return simulateApiCall(null);
    }
    
    const { passwordHash, ...userToReturn } = foundUser;
    return simulateApiCall(userToReturn);
};
