export interface DevRegisterRequest  {
  username: string;
  email: string;
  fullname: string;
  password: string;
  role: string;
  permission_id: string[];
}