export interface GiftCard {
  id?: number;
  value: number;
  used: boolean;
  balance: number;
  code: string;
  category?: any;
  categoryId?: number | null;
}
