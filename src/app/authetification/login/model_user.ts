export interface User {
  token: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  avatar: string;
  email: string;
  role:string;
  name: string;
  speciality:string;
  address:string;
  phone:string;
  password: string;
  __v: number;
  _id: string;
}
