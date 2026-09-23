export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  stockStatus?: 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK';
  category: any;
  brand?: string;
  createdAt?: string;
  updatedAt?: string;
  categoryId?: number;
}
