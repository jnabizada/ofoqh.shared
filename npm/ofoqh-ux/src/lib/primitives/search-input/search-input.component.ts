import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ofoqh-ux-search-input',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  host: { 'data-ux-component': 'search-input' },
})
export class UxSearchInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  protected onInput(next: string) {
    this.value = next;
    this.valueChange.emit(next);
  }

  protected triggerSearch() {
    const trimmed = (this.value ?? '').trim();
    if (!trimmed) {
      return;
    }

    this.search.emit(trimmed);
  }

  protected clearValue() {
    this.value = '';
    this.valueChange.emit('');
    this.clear.emit();
  }
}
