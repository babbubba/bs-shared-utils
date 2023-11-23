import { Observable, OperatorFunction, catchError, filter, last, map, of, tap } from "rxjs";
import { ApplicationService } from "./application.service";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppConfig } from "../models";

export function appConfigFactory(appService: ApplicationService): () => Observable<AppConfig | never[]> {
  return () => appService.getConfigFile().pipe(
    tap(conf => appService.appConfig$.next(conf)),
    catchError(err => {
      alert('Errore importando il file di configurazione. Contatta il supporto.');
      return of([])
    })
  )
}

export function dtConfigFactory(appService: ApplicationService): () => Observable<DataTables.Settings | never[]> {
  return () => appService.getDataTablesConfigFile().pipe(
    tap(conf => appService.dtConfig$.next(conf)),
    catchError(err => {
      alert("Error reading DataTable's configuration. Please contact the support.");
      return of([])
    })
  )
}

export function recaptchaConfigFactory(appService: ApplicationService) {
  return appService.appConfig?.recaptchaSiteKey;
}

export function HttpLoaderFactory(http: HttpBackend) {
  let client = new HttpClient(http);
  return new TranslateHttpLoader(client);
}
