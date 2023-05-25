import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'BsCheckbox',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckBoxComponent),
      multi: true
    }
  ]
})
export class CheckBoxComponent implements ControlValueAccessor {
  value?:boolean;
  touched = false;
  disabled = false;

  @Input() label!: string;
  @Input() description!: string;
  @Input() name!: string;
  @Input() wrap: boolean =true;

  constructor() {}

   onChange  = (value: any) => {};
   onTouched  = () => {};


  writeValue(value?: boolean): void {
    this.value = value;
  }

  registerOnChange(onChange: any): void {
    this.onChange  = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
   }

   markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
  }

  change() {
    this.markAsTouched();
    if(this.value){
      this.value = !this.value;
    }
    else {
      this.value = true;
    }
    this.onChange(this.value);
  }
}
