import { Globals, IUserSummary } from "../models";

export function GetJWTAccessToken():string | undefined {
  return localStorage.getItem(Globals.JWT_ACCESS_TOKEN) ?? undefined;
}

export function GetJWTRefreshToken():string | undefined {
  return localStorage.getItem(Globals.JWT_REFRESH_TOKEN) ?? undefined;
}

export function GetJWTRefreshTokenExpireDate():Date | undefined {
  let expireDate = localStorage.getItem(Globals.JWT_REFRESH_TOKEN_EXPIRE_DATE);
  if(!expireDate) return undefined;
  return new Date(JSON.parse(expireDate));
}

export function GetUserCookie():IUserSummary| undefined {
  let currentUserFromCookie = localStorage.getItem(Globals.CURRENT_USER_COOKIE);
  if(!currentUserFromCookie) return undefined;
  return JSON.parse(currentUserFromCookie);
}

export function SetJWTAccessToken(accessToken:string):void {
  return localStorage.setItem(Globals.JWT_ACCESS_TOKEN, accessToken);
}

export function SetJWTRefreshToken(refreshToken:string):void {
  return localStorage.setItem(Globals.JWT_REFRESH_TOKEN, refreshToken);
}

export function SetJWTRefreshTokenExpireDate(refreshTokenExpireDate:Date|undefined):void {
  if(!refreshTokenExpireDate) {
    localStorage.removeItem(Globals.JWT_REFRESH_TOKEN_EXPIRE_DATE);
  }
  return localStorage.setItem(Globals.JWT_REFRESH_TOKEN_EXPIRE_DATE, JSON.stringify(refreshTokenExpireDate));
}



