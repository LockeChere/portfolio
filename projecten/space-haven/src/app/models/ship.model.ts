import {User} from './user.model';

export interface Ship {
  imgUrl: string;
  size: string;
  carryingDangerous: boolean;
  shipTypeId: string;
}
