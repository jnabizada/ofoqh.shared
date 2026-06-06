import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UX_TRANSLATE } from '../../i18n/ux-i18n';

export interface UxLanguageOption {
  code: string;
  label: string;
  flag?: string | null;
}

@Component({
  selector: 'ofoqh-ux-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class UxLanguageSwitcherComponent {
  private readonly translate = inject(UX_TRANSLATE);

  @Input() label = '';
  @Input() options: UxLanguageOption[] = [];
  @Input() selectedCode: string | null = null;

  @Output() selectedCodeChange = new EventEmitter<string>();

  protected trackOption(index: number, option: UxLanguageOption): string {
    return option.code || `${index}`;
  }

  protected resolvedLabel(): string {
    return this.label.trim() || this.translate('ux.languageSwitcher.label', 'Language');
  }

  protected selectLanguage(code: string): void {
    if (!code || code === this.selectedCode) {
      return;
    }

    this.selectedCodeChange.emit(code);
  }
}
