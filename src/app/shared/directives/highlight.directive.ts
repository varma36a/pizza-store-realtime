import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  readonly appHighlight = input<string>('#fff3e0');
  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener('mouseenter')
  onEnter(): void {
    this.el.nativeElement.style.backgroundColor = this.appHighlight();
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
