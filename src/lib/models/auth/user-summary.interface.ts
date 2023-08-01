import { IRole } from "./role.interface";

export interface IUserSummary {
  refreshToken?: string;
  refreshTokenExpire?: Date;
  id: string;
  username: string;
  displayName: string;
  accessToken?: string;
  roles: IRole[];
  email: string;
  isEnabled: string;
  lastLogin: Date;
}
