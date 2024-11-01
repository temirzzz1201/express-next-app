import { ReactNode } from 'react';

interface Image {
  id: number;
  imageUrl: string;
  productId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IIProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category?: ICategory;
  images: { imageUrl: string }[];
  product: IIProduct;
}

interface IProductImage {
  imageUrl: string;
}

export interface IOrder {
  id: number;
  userId: number;
  createdAt: string;
  total_price: number;
  quantity: number;
  productId: number;
  Product: IIProduct | null;
  description: string;
}

export interface IBusketProduct {
  id: number;
  product: IIProduct;
  quantity: number;
}

export interface IIProductResponse {
  data: {
    message: string;
    product: IIProduct;
  };
  status: number;
  statusText: string;
}

export interface IIProducts {
  currentProduct: IIProduct | null;
  products: IIProduct[];
  isLoading: boolean;
  error: string | null;
}

export interface ICategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryMenuProps {
  categories: ICategory[];
}

export interface ICategires {
  category: ICategory[];
  isLoading: boolean;
  error: string | null;
}

export interface IAuthState {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null | Error;
}

export interface IUser {
  id?: number;
  username?: string | null;
  email: string;
  password: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUsersState {
  users: IUser[];
  isLoading: boolean;
  error: string | null | object;
}

export interface IUserResponse {
  role: string;
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface IProtectedRoute {
  component: React.ReactElement;
}

export interface IFormValues {
  username?: string;
  role?: string;
  email: string;
  password: string;
}

export interface IFormErrors {
  username?: string;
  email?: string;
  password?: string;
}

export interface ITableColumn {
  label: string;
  key: string;
  format?: (value: any) => string;
}

export interface IAdminTableProps {
  caption: string;
  columns: ITableColumn[];
  data: any[];
  isLoading: boolean;
  deleteFlag: string;
  updateFlag: string;
}

export interface IHomeProps {
  searchParams: {
    category?: string;
  };
}

export interface IModalProps {
  children: ReactNode;
}

export interface IProductCardProps {
  product: IIProduct;
}

export interface IOrdersState {
  orders: IOrder[];
  loading: boolean;
  error: string | null;
}

export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ICart {
  id: string;
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  quantity: number;
}

export interface IContainerProps {
  title: string;
  children: ReactNode;
  myClass: string;
}


export interface AppModalProps extends IModalProps {
  modalSize: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}