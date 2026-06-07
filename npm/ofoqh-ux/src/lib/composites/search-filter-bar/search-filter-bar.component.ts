import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UX_TRANSLATE } from '../../i18n/ux-i18n';

@Component({
  selector: 'ofoqh-ux-search-filter-bar',
  standalone: true,
  templateUrl: './search-filter-bar.component.html',
  styleUrl: './search-filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-ux-component': 'search-filter-bar' },
})
export class UxSearchFilterBarComponent {
  private readonly translate = inject(UX_TRANSLATE);

  @Input() eyebrow: string | null = null;
  @Input() title = '';
  @Input() subhead = '';
  @Input() summaryText = '';
  @Input() resultTag = '';
  @Input() showReset = true;
  @Input() resetLabel = '';
  @Input() compact = false;

  @Output() readonly reset = new EventEmitter<void>();

  protected resolvedResetLabel(): string {
    return this.resetLabel.trim() || this.translate('ux.searchFilterBar.reset', 'Reset filters');
  }
}
