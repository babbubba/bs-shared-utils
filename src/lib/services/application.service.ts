import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { AppConfig, Globals, IRefreshToken, IUserSummary } from '../models';
import { GetJWTAccessToken, GetJWTRefreshToken, SetJWTAccessToken, SetJWTRefreshToken, SetJWTRefreshTokenExpireDate } from './jwt.function';
import { ApiResponseValue } from '../models/api/api-response-value.interface';

@Injectable({
  providedIn: 'root'
})

export class ApplicationService {
  private httpBackendClient: HttpClient;
  appConfig$: BehaviorSubject<AppConfig | undefined> = new BehaviorSubject<AppConfig | undefined>(undefined);
  dtConfig$: BehaviorSubject<DataTables.Settings | undefined> = new BehaviorSubject<DataTables.Settings | undefined>(undefined);
  currentUser$: BehaviorSubject<IUserSummary | undefined> = new BehaviorSubject<IUserSummary| undefined>(undefined);
  tokenRefreshed$: BehaviorSubject<string| undefined> = new BehaviorSubject<string|undefined>(undefined);
  IsRefreshing: boolean = false;
  appConfig?: AppConfig;

  constructor(
    private handler: HttpBackend) {
    this.httpBackendClient = new HttpClient(this.handler);
    this.appConfig$.subscribe(res=> this.appConfig = res);
  }

  getConfigFile() {
    return this.httpBackendClient.get<AppConfig>(Globals.CONFIG_PATH);
  }

  getDataTablesConfigFile() {
    return this.httpBackendClient.get<DataTables.Settings>(Globals.DATATABLES_CONFIG_PATH);
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
    const refreshRespone = await firstValueFrom(this.httpBackendClient.post<ApiResponseValue<IRefreshToken>>(`${this.appConfig?.apiEndpointUrl}/api/Authentication/refresh`, { accessToken: token, refreshToken: refreshToken }));
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
    this.tokenRefreshed$.next(refreshToken?.accessToken);
    SetJWTAccessToken(refreshToken?.accessToken??'');
    SetJWTRefreshToken(refreshToken?.refreshToken??'');
    SetJWTRefreshTokenExpireDate(refreshToken?.refreshTokenExpire)
  }





}


