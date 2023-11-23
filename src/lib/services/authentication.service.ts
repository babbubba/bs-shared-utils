import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable, last, lastValueFrom, map, of, switchMap } from 'rxjs';
import { Globals, IUserSummary } from '../models';
import { ApiResponseValue, ApiResponse } from '../../public-api';
import { ApplicationService } from './application.service';
import { ServiceBase } from './service-base.service';
import { ILoginDto } from '../models/auth/login-dto.interface';
import { IAuthRegisterDto } from '../models/auth/auth-register-dto.interface';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends ServiceBase {
  httpWithoutInterceptor: HttpClient;

  constructor(appService: ApplicationService, transService: TranslateService, private router: Router, private httpBackend: HttpBackend, private httpClient: HttpClient, private recaptchaV3Service: ReCaptchaV3Service) {
    super(appService, transService, httpClient);
    this.httpWithoutInterceptor = new HttpClient(this.httpBackend);
  }

  goToLogin(requestedUrl: string | null = null) {
    if (!this.isLoggedIn()) {
      this.router.navigate(
        ['/login'],
        {
          queryParams: { requrl: requestedUrl }
        }
      );
    } else {
      if (requestedUrl && typeof requestedUrl == 'string') {
        this.router.navigate([requestedUrl]);
      }
      else {
        this.router.navigate(['']);
      }
    }

  }

  confirmEmail(userId: string, confirmationId: string) {
    return this.httpWithoutInterceptor.post<ApiResponse>(`${this.apiUrl}api/Authentication/confirmEmail?UserId=${userId}&ConfirmationId=${confirmationId}`, {});
  }

  /**
 * @deprecated Utilizzare login2() questa funzione verrà rimossa nella versione 1.2.x
 */
  login(loginDto: ILoginDto): Promise<void> {
    return new Promise<void>(async (response, reject) => {
      try {

        // Rcaptcha
        loginDto.recaptchaToken = await lastValueFrom(this.recaptchaV3Service.execute('login'));

        // Call backend authentication
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

  /*
  Avvia il processo di registrazione di un utente
  */
  register(authRegisterDto: IAuthRegisterDto): Observable<ApiResponseValue<string>> {
    const getRecaptchaV3Token$ = this.recaptchaV3Service.execute('register');
    const registerUser$ = this.httpWithoutInterceptor.post<ApiResponseValue<string>>(`${this.apiUrl}api/authentication/register`, authRegisterDto);

    return getRecaptchaV3Token$.pipe(last(), switchMap(recaptchaToken => {
      authRegisterDto.recaptchaToken = recaptchaToken;
      return registerUser$;
    }));
  }

  /**
   *
   * @param loginDto The login request DTO (the 'recaptchaToken' field will be auto populated by service)
   * @returns a bool true value when success otherwis a string that represent the error message
   */
  login2(loginDto: ILoginDto) {
    const getRecaptchaV3Token$ = this.recaptchaV3Service.execute('login');
    const authenticate$ = this.httpWithoutInterceptor.post<ApiResponseValue<IUserSummary>>(`${this.apiUrl}api/Authentication/authenticate`, loginDto);


    return getRecaptchaV3Token$.pipe(
      switchMap(recaptchaToken => {
        loginDto.recaptchaToken = recaptchaToken;
        return authenticate$;
      }),
      switchMap(authenticateResponse => {
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
          return of(true);
        }
        else {
          return of(authenticateResponse.errorMessage);
        }
      })
    );
  }
}
