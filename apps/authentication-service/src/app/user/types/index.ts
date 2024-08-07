import { AuthTypeEnum, RoleTypeEnum } from 'types';

export interface IRegisterUserResponse {
  id: number;
  email: string;
  emailConfirmationEndpoint: string;
}

export interface ILoginUserResponse {
  id: number;
  email: string;
  accessToken: string;
}

export interface IPatchUserResponse {
  id: number;
  email: string;
  role: RoleTypeEnum;
}

export interface IGetUserResponse {
  id: number;
  email: string;
  role: RoleTypeEnum;
  authType: AuthTypeEnum;
  isEmailVerified: boolean;
}
