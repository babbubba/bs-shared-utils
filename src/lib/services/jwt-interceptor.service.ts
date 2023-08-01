import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { finalize, from, lastValueFrom } from 'rxjs';
import { ApplicationService } from './application.service';
import { JwtTokenService } from './jwt-token.service';
import { Delay } from './extra.function';
import { GetJWTAccessToken } from './jwt.function';

/**
 * This intercept all request and add the JWT token in the header if needed
 *
 * @export
 * @class JwtInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private applicationService: ApplicationService,
    private jwtTokenService: JwtTokenService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // convert promise to observable using 'from' operator
    return from(this.handle(req, next))
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    // dont show spinner if the url contains 'uplodad' avoiding showing spinner during upload
    if (req.url.indexOf('upload')<= 0 && req.url.indexOf('KeepAlive')<= 0) {
      // this.spinner.show();
    }

    do {
      await Delay(20);
    }
    while (this.jwtTokenService.IsRefreshing);


    let refreshTokenResult: boolean = true;

    if (this.jwtTokenService.TokenExpired()) {
      // we need to try refresh the access token
      this.jwtTokenService.IsRefreshing = true;
      refreshTokenResult = await this.jwtTokenService.TryRefreshToken();
    }

    req = this.setRequestHeader(refreshTokenResult, req);

    return await this.finalizeRequest(next, req);
  }


  private async finalizeRequest(next: HttpHandler, req: HttpRequest<any>) {
    return await lastValueFrom(
      next.handle(req)
        .pipe(finalize(() => {
          if (req.url.indexOf('upload')<= 0 && req.url.indexOf('KeepAlive')<= 0) {
            // this.spinner.hide();
          }
        }))
    );
  }

  private setRequestHeader(refreshTokenResult: boolean, req: HttpRequest<any>) {
    if (!this.jwtTokenService.TokenExists() || !refreshTokenResult) {
      // set only timeout in the request header
      req = this.setUnhautorizedHeader(req);
    }
    else {
      req = this.setAuthorizedHeader(req);
    }
    return req;
  }

  private setAuthorizedHeader(req: HttpRequest<any>) {
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + GetJWTAccessToken(),
        Timeout: `${this.applicationService.appConfig?.apiTimeoutSeconds??30 * 1000 | 15000}`
      }
    });
    return req;
  }

  private setUnhautorizedHeader(req: HttpRequest<any>) {
    req = req.clone({
      setHeaders: {
        Timeout: `${this.applicationService.appConfig?.apiTimeoutSeconds??30 * 1000 | 15000}`
      }
    });
    return req;
  }
}
