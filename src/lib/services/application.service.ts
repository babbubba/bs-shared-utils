import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig, Globals } from '../models';

@Injectable({
  providedIn: 'root'
})

export class ApplicationService {
  httpClient: HttpClient;
  appConfig$: BehaviorSubject<AppConfig | undefined> = new BehaviorSubject<AppConfig | undefined>(undefined);
  dtConfig$: BehaviorSubject<DataTables.Settings | undefined> = new BehaviorSubject<DataTables.Settings | undefined>(undefined);

  constructor(
    private handler: HttpBackend) {
    this.httpClient = new HttpClient(this.handler);
  }

  getConfigFile() {
    return this.httpClient.get<AppConfig>(Globals.CONFIG_PATH);
  }

  getDataTablesConfigFile() {
    return this.httpClient.get<DataTables.Settings>(Globals.DATATABLES_CONFIG_PATH);
  }

}


