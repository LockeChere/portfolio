export interface UserData {
  userId: number;
  email: string;
  role: string;
}

export interface Product {
  productId: number;
  productName: string;
  price: number;
}

export interface ProductData {
  products: Product[];
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  id: number;
  user: {
    id: number;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: string;
  totalPrice: number;
  orderDate: string;
  status: string;
  returnStatus?: string;
} 