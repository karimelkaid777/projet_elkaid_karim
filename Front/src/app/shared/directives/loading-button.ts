import {Directive, ElementRef, Input, Renderer2, effect, input} from '@angular/core';

@Directive({
  selector: '[appLoadingButton]'
})
export class LoadingButtonDirective {
  loading = input<boolean>(false);

  private spinnerElement: HTMLElement | null = null;
  private buttonElement: HTMLElement;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {
    this.buttonElement = this.elementRef.nativeElement;
    this.injectStyles();

    effect(() => {
      if (this.loading()) {
        this.showLoading();
      } else {
        this.hideLoading();
      }
    });
  }

  private injectStyles() {
    const styleId = 'loading-button-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .loading-button-spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 14px;
          height: 14px;
          margin: -7px 0 0 -7px;
          border: 2px solid var(--color-gray-300, #d1d5db);
          border-top-color: var(--color-primary, #0f766e);
          border-radius: 50%;
          animation: loading-button-spin 0.7s linear infinite;
        }
        @keyframes loading-button-spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  private showLoading() {
    this.renderer.setStyle(this.buttonElement, 'position', 'relative');
    this.renderer.setStyle(this.buttonElement, 'color', 'transparent');
    this.renderer.setStyle(this.buttonElement, 'pointer-events', 'none');
    this.renderer.setAttribute(this.buttonElement, 'disabled', 'true');

    this.spinnerElement = this.renderer.createElement('span');
    this.renderer.addClass(this.spinnerElement, 'loading-button-spinner');
    this.renderer.appendChild(this.buttonElement, this.spinnerElement);
  }

  private hideLoading() {
    this.renderer.removeStyle(this.buttonElement, 'color');
    this.renderer.removeStyle(this.buttonElement, 'pointer-events');
    this.renderer.removeAttribute(this.buttonElement, 'disabled');

    if (this.spinnerElement) {
      this.renderer.removeChild(this.buttonElement, this.spinnerElement);
      this.spinnerElement = null;
    }
  }
}
