import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ofoqh-ux-page-hero',
  standalone: true,
  templateUrl: './page-hero.component.html',
  styleUrl: './page-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-ux-component': 'page-hero' },
})
export class UxPageHeroComponent {
  readonly eyebrow = input<string | null>(null);
  readonly title = input<string | null>(null);
  readonly lede = input<string | null>(null);
  readonly compact = input(false);
}
