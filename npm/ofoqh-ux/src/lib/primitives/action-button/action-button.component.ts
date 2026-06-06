import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule, MatMenuPanel } from '@angular/material/menu';

export type UxActionButtonVariant = 'text' | 'flat' | 'stroked' | 'raised';
export type UxActionButtonType = 'button' | 'submit' | 'reset';
export type UxActionButtonTone = 'default' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'ofoqh-ux-action-button',
  standalone: true,
  imports: [MatMenuModule],
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
})
export class UxActionButtonComponent {
  @Input() variant: UxActionButtonVariant = 'text';
  @Input() color: 'primary' | 'accent' | 'warn' | undefined;
  @Input() tone: UxActionButtonTone = 'default';
  @Input() type: UxActionButtonType = 'button';
  @Input() disabled = false;
  @Input() menuTriggerFor: MatMenuPanel<any> | null = null;

  @Output() pressed = new EventEmitter<MouseEvent>();
  @Output('click') clicked = new EventEmitter<MouseEvent>();

  protected onClick(event: MouseEvent) {
    this.pressed.emit(event);
    this.clicked.emit(event);
  }
}
