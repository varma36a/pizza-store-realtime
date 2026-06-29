import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  readonly appClickOutside = output<void>();
  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null): void {
    if (target instanceof Node && !this.el.nativeElement.contains(target)) {
      this.appClickOutside.emit();
    }
  }
}
