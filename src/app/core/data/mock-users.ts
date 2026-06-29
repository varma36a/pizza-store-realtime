import { User } from '../models/user.model';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    email: 'customer@pizza.com',
    name: 'Alex Customer',
    role: 'customer',
  },
  {
    id: 'u2',
    email: 'admin@pizza.com',
    name: 'Admin Chef',
    role: 'admin',
  },
];

export const DEMO_PASSWORD = 'password123';
