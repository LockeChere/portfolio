export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  createdAt?: Date;
  updatedAt?: Date;
} 