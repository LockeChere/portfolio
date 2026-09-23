import {UserFaction} from './UserFaction.model';

export interface User {
  email: string;
  token: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  userFaction: UserFaction;
}
