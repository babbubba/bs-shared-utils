import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class IstantNotifyService {

  constructor(private toastr: ToastrService) { }

  success(message:string, title:string|undefined) {
    this.toastr.success(message, title);
  }
  warning(message:string, title:string|undefined) {
    this.toastr.warning(message, title);
  }
  info(message:string, title:string|undefined) {
    this.toastr.info(message, title);
  }
  error(message:string, title:string|undefined) {
    this.toastr.error(message, title);
  }
}
