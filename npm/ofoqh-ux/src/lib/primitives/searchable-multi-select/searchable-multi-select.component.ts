import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ofoqh-ux-searchable-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchable-multi-select.component.html',
  styleUrl: './searchable-multi-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UxSearchableMultiSelectComponent),
      multi: true,
    },
  ],
})
export class UxSearchableMultiSelectComponent implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input() options: readonly string[] = [];
  @Input() searchPlaceholder = 'Search';
  @Input() emptyLabel = 'No options match your search.';
  @Input() selectionPlaceholder = 'Select one or more options';

  protected open = false;
  protected searchTerm = '';
  protected selected: string[] = [];
  protected isDisabled = false;

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: readonly string[] | null): void {
    this.selected = Array.isArray(value) ? [...value].sort((left, right) => left.localeCompare(right)) : [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  protected togglePanel() {
    if (this.isDisabled) {
      return;
    }

    this.open = !this.open;
    this.onTouched();
  }

  protected toggleOption(option: string) {
    if (this.isDisabled) {
      return;
    }

    if (this.selected.includes(option)) {
      this.selected = this.selected.filter(item => item !== option);
    } else {
      this.selected = [...this.selected, option].sort((left, right) => left.localeCompare(right));
    }

    this.onChange(this.selected);
    this.onTouched();
  }

  protected removeOption(option: string) {
    if (this.isDisabled || !this.selected.includes(option)) {
      return;
    }

    this.selected = this.selected.filter(item => item !== option);
    this.onChange(this.selected);
    this.onTouched();
  }

  protected isSelected(option: string) {
    return this.selected.includes(option);
  }

  protected filteredOptions() {
    const query = this.searchTerm.trim().toLowerCase();
    return this.options.filter(option => !query || option.toLowerCase().includes(query));
  }

  protected summaryLabel() {
    if (this.selected.length === 0) {
      return this.selectionPlaceholder;
    }

    if (this.selected.length <= 2) {
      return this.selected.join(', ');
    }

    return `${this.selected.length} selected`;
  }

  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: MouseEvent) {
    if (!this.open) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.open = false;
      this.onTouched();
    }
  }
}
