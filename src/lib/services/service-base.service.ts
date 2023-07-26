import { AppConfig, IUserSummary } from '../models';
import { ApplicationService } from './application.service';
import { TranslateService } from '@ngx-translate/core';


export abstract class ServiceBase {
  protected appConfig?: AppConfig;
  protected dtConfig?: DataTables.Settings;
  protected currentUser?: IUserSummary;
  protected tokenRefreshed?: string;

  constructor(
    public applicationService: ApplicationService,
    public translateService: TranslateService) {
    applicationService.appConfig$.subscribe(res => this.appConfig = res);
    applicationService.dtConfig$.subscribe(res => this.dtConfig = res);
    applicationService.currentUser$.subscribe(res => this.currentUser = res);
    applicationService.tokenRefreshed$.subscribe(res => this.tokenRefreshed = res);
  }

  protected T(messageKey: string, interpolatedParams: Object | undefined = undefined): string {
    return this.translateService.instant(messageKey, interpolatedParams);
  }

  protected get apiUrl(): string {
    let result = '';
    if (this.appConfig) {
      result = this.appConfig?.apiEndpointUrl;
      if (!result.endsWith('/')) {
        result += '/';
      }
    }
    return result;
  }
}


