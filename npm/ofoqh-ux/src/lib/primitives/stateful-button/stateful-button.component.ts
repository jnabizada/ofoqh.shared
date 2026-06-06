import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type UxStatefulButtonState = 'idle' | 'loading' | 'success' | 'error';
export type UxStatefulButtonTone = 'primary' | 'secondary' | 'danger' | 'success' | 'neutral';
export type UxStatefulButtonSize = 'sm' | 'md' | 'lg';
export type UxStatefulButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'ofoqh-ux-stateful-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stateful-button.component.html',
  styleUrl: './stateful-button.component.scss',
})
export class UxStatefulButtonComponent {
  @Input() state: UxStatefulButtonState = 'idle';
  @Input() tone: UxStatefulButtonTone = 'primary';
  @Input() size: UxStatefulButtonSize = 'md';
  @Input() type: UxStatefulButtonType = 'button';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() idleLabel = '';
  @Input() loadingLabel = 'Working...';
  @Input() successLabel = 'Done';
  @Input() errorLabel = 'Failed';

  @Output() pressed = new EventEmitter<MouseEvent>();
  @Output('click') clicked = new EventEmitter<MouseEvent>();

  protected onClick(event: MouseEvent) {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.pressed.emit(event);
    this.clicked.emit(event);
  }

  protected isDisabled() {
    return this.disabled || this.state === 'loading';
  }

  protected visualState() {
    if (this.disabled && this.state === 'idle') {
      return 'disabled';
    }

    return this.state;
  }

  protected currentLabel() {
    switch (this.state) {
      case 'loading':
        return this.loadingLabel || this.idleLabel;
      case 'success':
        return this.successLabel || this.idleLabel;
      case 'error':
        return this.errorLabel || this.idleLabel;
      default:
        return this.idleLabel;
    }
  }
}
