import {Component, input, output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-loading-button',
  imports: [],
  templateUrl: './loading-button.html',
  styleUrl: './loading-button.scss',
  encapsulation: ViewEncapsulation.None
})
export class LoadingButton {
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  buttonType = input<'button' | 'submit'>('button');
  buttonClass = input<string>('');

  clicked = output<MouseEvent>();

  handleClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.loading() && !this.disabled()) {
      this.clicked.emit(event);
    }
  }

  isButtonDisabled(): boolean {
    return this.loading() || this.disabled();
  }
}
