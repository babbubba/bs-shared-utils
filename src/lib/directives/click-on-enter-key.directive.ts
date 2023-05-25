import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * This directive execute the click action on the element when the 'enter' key is pressed
 *
 * @export
 * @class ClickOnEnterKeyDirective
 */
@Directive({
  selector: '[clickOnEnterKey]'
})
export class ClickOnEnterKeyDirective {

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.elementRef.nativeElement.click();
  }
}
