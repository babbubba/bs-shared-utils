import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { CheckBoxComponent } from './components/check-box/check-box.component';
import { MessageModalComponent } from './components/message-modal/message-modal.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { BrokenPageComponent } from './components/broken-page/broken-page.component';
import { RouterModule } from '@angular/router';
import { BytesPipe } from './pipes/bytes.pipe';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { ApplicationService } from './services/application.service';

@NgModule({
  declarations: [
    CheckBoxComponent,
    MessageModalComponent,
    ConfirmModalComponent,
    BrokenPageComponent,
    BytesPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    DataTablesModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([{ path: 'shared/broken', component: BrokenPageComponent }]),
    NgxSpinnerModule,
    RecaptchaV3Module
  ],
  exports: [
    CheckBoxComponent,
    MessageModalComponent,
    ConfirmModalComponent,
    BrokenPageComponent,
    BytesPipe,
  ],
  providers: [

  ]
})
export class BsSharedUtilsModule { }


