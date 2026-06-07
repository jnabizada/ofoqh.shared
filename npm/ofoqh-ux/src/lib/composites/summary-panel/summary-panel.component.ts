import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ofoqh-ux-summary-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-panel.component.html',
  styleUrl: './summary-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-ux-component': 'summary-panel' },
})
export class UxSummaryPanelComponent {
  readonly title = input<string | null>(null);
  readonly subhead = input<string | null>(null);
  readonly columns = input<1 | 2 | 3 | 4>(4);

  protected gridTemplateColumns() {
    switch (this.columns()) {
      case 1:
        return 'repeat(1, minmax(0, 1fr))';
      case 2:
        return 'repeat(2, minmax(0, 1fr))';
      case 3:
        return 'repeat(3, minmax(0, 1fr))';
      default:
        return 'repeat(4, minmax(0, 1fr))';
    }
  }
}
