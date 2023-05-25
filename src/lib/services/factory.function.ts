import { Observable, catchError, of, tap } from "rxjs";
import { AppConfig } from "../models";
import { ApplicationService } from "./application.service";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

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
      alert('Errore importando il file di configurazione di DataTables. Contatta il supporto.');
      return of([])
    })
  )
}

export function HttpLoaderFactory(http: HttpBackend) {
  let client = new HttpClient(http);
  return new TranslateHttpLoader(client);
}
