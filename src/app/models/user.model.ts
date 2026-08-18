export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UserRequest {
  name: string;
  email: string;
  password?: string;
}
