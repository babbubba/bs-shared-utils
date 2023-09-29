import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Globals, IUserSummary } from '../models';
import { ApiResponseValue, ApiResponse } from '../../public-api';
import { ApplicationService } from './application.service';
import { ServiceBase } from './service-base.service';
import { ILoginDto } from '../models/auth/login-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends ServiceBase {
  httpWithoutInterceptor: HttpClient;

  constructor(appService: ApplicationService, transService: TranslateService, private router: Router, private httpBackend: HttpBackend, private httpClient: HttpClient) {
    super(appService, transService);
    this.httpWithoutInterceptor = new HttpClient(this.httpBackend);
  }

  goToLogin(requestedUrl: string | null = null) {
    this.router.navigate(
      ['/login'],
      {
        queryParams: { requrl: requestedUrl }
      }
    );
  }




  login(loginDto: ILoginDto): Promise<void> {
    return new Promise<void>(async (response, reject) => {
      try {
        const authenticateResponse = await lastValueFrom(this.httpWithoutInterceptor.post<ApiResponseValue<IUserSummary>>(`${this.apiUrl}api/Authentication/authenticate`, loginDto));
        if (authenticateResponse.success) {
          this.applicationService.PersistTokens({
            accessToken: authenticateResponse.value.accessToken ?? '',
            refreshToken: authenticateResponse.value.refreshToken ?? '',
            refreshTokenExpire: authenticateResponse.value.refreshTokenExpire ?? new Date
          });
          delete authenticateResponse.value.accessToken;
          delete authenticateResponse.value.refreshToken;
          delete authenticateResponse.value.refreshTokenExpire;

          // store user details in local storage to keep user logged in
          localStorage.setItem(Globals.CURRENT_USER_COOKIE, JSON.stringify(authenticateResponse.value));
          this.applicationService.currentUser$.next(authenticateResponse.value);
          response();
          return;
        }
        else {
          this.applicationService.currentUser$.next(undefined);
          reject(authenticateResponse.errorMessage);
        }
      } catch (err: any) {
        this.applicationService.currentUser$.next(undefined);
        reject(err?.error?.error || err?.message || 'Generic error')
      }
    });
  }

  logout() {
    localStorage.removeItem(Globals.CURRENT_USER_COOKIE);
    this.applicationService.PersistTokens(undefined);
    this.applicationService.currentUser$.next(undefined);
  }


  isLoggedIn(): boolean {
    return !this.applicationService.TokenExpired();
  }
  keepalive() {
    return this.httpClient.post<ApiResponse>(`${this.apiUrl}api/Authentication/KeepAlive`, {});
  }

}
