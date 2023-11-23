import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { AppConfig, Globals, IRefreshToken, IUserSummary } from '../models';
import { GetJWTAccessToken, GetJWTRefreshToken, GetUserCookie, SetJWTAccessToken, SetJWTRefreshToken, SetJWTRefreshTokenExpireDate } from './jwt.function';
import { ApiResponseValue } from '../models/api/api-response-value.interface';

@Injectable({
  providedIn: 'root'
})

export class ApplicationService {
  private httpBackendClient: HttpClient;
  appConfig$: BehaviorSubject<AppConfig | undefined> = new BehaviorSubject<AppConfig | undefined>(undefined);
  dtConfig$: BehaviorSubject<DataTables.Settings | undefined> = new BehaviorSubject<DataTables.Settings | undefined>(undefined);
  currentUser$: BehaviorSubject<IUserSummary | undefined>;// = new BehaviorSubject<IUserSummary| undefined>(undefined);
  tokenRefreshed$: BehaviorSubject<string| undefined> = new BehaviorSubject<string|undefined>(undefined);
  IsRefreshing: boolean = false;
  appConfig?: AppConfig;

  constructor(
    private handler: HttpBackend) {
    this.httpBackendClient = new HttpClient(this.handler);
    this.appConfig$.subscribe(res=> this.appConfig = res);
    this.currentUser$ = new BehaviorSubject<IUserSummary| undefined>(GetUserCookie());
  }

  /**
   * Read the application settings from configuration file (defined in Globals.CONFIG_PATH)
   * @returns the instance of 'AppConfig' defined in application config file
   */
  getConfigFile() {
    return this.httpBackendClient.get<AppConfig>(Globals.CONFIG_PATH);
  }

  /**
   * Read the datatable.net settings from configuration file (defined in Globals.DATATABLES_CONFIG_PATH constant)
   * @returns the instance of 'DataTables.Settings' defined in datatable config file
   */
  getDataTablesConfigFile() {
    return this.httpBackendClient.get<DataTables.Settings>(Globals.DATATABLES_CONFIG_PATH);
  }

  /**
   * Call the backend and return the current assembly version
   * @returns The backend API's assembly version (string)
   */
  getBackendVersion() {
    return this.httpBackendClient.get<string>(`${this.appConfig?.apiEndpointUrl}/api/Application/version`);
  }

  /**
   * Checks if the access token is presents in the current local storage cookie
   * @returns true if the access token exists otherwise false
   */
  public TokenExists(): boolean {
    return GetJWTAccessToken() !== undefined;
  }

/**
 * Checks if the access token stored in current local storahe cookie is expired
 * @returns true if the acess token expired otherwise false
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


