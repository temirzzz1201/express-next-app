export interface IIProduct {
  id: string;
  categoryId: number;
  name: string;
  description: string;
  price: number | null;
  stock: number | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IIProducts {
  products: IIProduct[];
  isLoading: boolean;
  error: string | null;
}

export interface ICategory {
  id: string;
  categoryName: string | null;
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
}