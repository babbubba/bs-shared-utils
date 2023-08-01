import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { firstValueFrom, Subject } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { ApplicationService } from './application.service';
import { GetJWTAccessToken, GetJWTRefreshToken, SetJWTAccessToken, SetJWTRefreshToken, SetJWTRefreshTokenExpireDate } from './jwt.function';
import { ApiResponseValue } from '../models/api/api-response-value.interface';
import { IRefreshToken } from '../models/auth/refresh-token.interface';


@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  tokenRefreshed$: Subject<string> = new Subject();
  public IsRefreshing: boolean = false;
  httpWithoutInterceptor: HttpClient;

  constructor(
    private httpBackend:HttpBackend,
    private appConfigService: ApplicationService) {
    this.httpWithoutInterceptor = new HttpClient(this.httpBackend);
  }

  public TokenExists(): boolean {
    return GetJWTAccessToken() !== undefined;
  }

  /**
   * Return true if token expired or not exists
   *
   * @return {*}  {boolean}
   * @memberof JwtTokenService
   */
  public TokenExpired(): boolean {
    const token = GetJWTAccessToken();
    if(!token) return true;
    let jwtToke = jwt_decode(token) as any;
    return ((Math.floor((new Date).getTime() / 1000)) >= jwtToke.exp)
  }

  /**
   * Request the refreshed access token to bakend and set it in storage. It returns true if refreshing was succeffully completed otherwise false.
   *
   * @return {*}  {Promise<boolean>}
   * @memberof JwtTokenService
   */
  public async TryRefreshToken(): Promise<boolean> {
    const token = GetJWTAccessToken();
    const refreshToken = GetJWTRefreshToken();
    if (!token || !refreshToken) {
      // we must execute login again
      this.IsRefreshing = false;
      return false;
    }

    let result:boolean = true;
    try {
      const refreshRespone = await firstValueFrom(this.httpWithoutInterceptor.post<ApiResponseValue<IRefreshToken>>(`${this.appConfigService.appConfig?.apiEndpointUrl}/api/Authentication/refresh`, { accessToken: token, refreshToken: refreshToken }));
      if (refreshRespone.success) {
        this.PersistTokens(refreshRespone.value);
      }
      else {
        console.error(refreshRespone);
        result=false;
      }
    } catch (error) {
      console.error(error);
      result=false;
    }

    this.IsRefreshing = false;
    return result;
  }

  /**
   * Persists the tokens (access and refresh) in the current browser storage
   *
   * @param {string} accessToken
   * @param {string} refreshToken
   * @memberof JwtTokenService
   */
  public PersistTokens(refreshToken:IRefreshToken | undefined) {
    this.tokenRefreshed$.next(refreshToken?.accessToken??'');
    SetJWTAccessToken(refreshToken?.accessToken??'');
    SetJWTRefreshToken(refreshToken?.refreshToken??'');
    SetJWTRefreshTokenExpireDate(refreshToken?.refreshTokenExpire)
  }
}
