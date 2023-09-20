import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
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
    RouterModule.forChild([{path: 'shared/broken', component: BrokenPageComponent}])
  ],
  exports: [
    CheckBoxComponent,
    MessageModalComponent,
    ConfirmModalComponent,
    BrokenPageComponent,
    BytesPipe,
  ]
})
export class BsSharedUtilsModule { }
