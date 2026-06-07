import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  inject,
  input,
} from '@angular/core';

@Component({
  selector: 'ofoqh-ux-summary-card, ofoqh-summary-metric-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-ux-component': 'summary-card' },
})
export class UxSummaryCardComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly eyebrow = input<string | null>(null);
  readonly title = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly tone = input<'default' | 'accent' | 'muted'>('default');
  readonly dense = input(false);
  @Input() label: string | null = null;
  @Input() variant: 'default' | 'count' | 'date' | 'status' | 'code' | 'accent' = 'default';

  @HostBinding('attr.data-tone')
  protected get hostTone() {
    return this.tone() !== 'default' ? this.tone() : this.variant === 'accent' ? 'accent' : 'default';
  }

  @HostBinding('attr.data-variant')
  protected get hostVariant() {
    return this.variant;
  }

  @HostBinding('class.ux-summary-card-host--dense')
  protected get hostDense() {
    return this.dense();
  }

  ngAfterContentChecked() {
    this.syncProjectedTooltip('[uxSummaryHint], [summaryMetricHint]');
    this.syncProjectedTooltip('[uxSummaryValue], [summaryMetricValue]');
  }

  protected resolvedTitle() {
    return this.title() ?? this.label;
  }

  private syncProjectedTooltip(selector: string) {
    const element = this.host.nativeElement.querySelector(selector) as HTMLElement | null;
    const text = element?.textContent?.trim();
    if (!element || !text) {
      return;
    }

    element.title = text;
  }
}
