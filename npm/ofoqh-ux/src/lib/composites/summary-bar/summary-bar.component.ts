import { CommonModule } from '@angular/common';
import { AfterContentChecked, ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';

@Component({
  selector: 'ofoqh-ux-summary-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-bar.component.html',
  styleUrl: './summary-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UxSummaryBarComponent implements AfterContentChecked {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly eyebrow = input<string | null>(null);
  readonly title = input<string | null>(null);
  readonly subhead = input<string | null>(null);
  readonly columns = input<1 | 2 | 3 | 4>(4);
  readonly minCardWidth = input('220px');
  readonly dense = input(false);

  ngAfterContentChecked() {
    this.assertAllowedChildren();
  }

  protected gridTemplateColumns() {
    const width = this.minCardWidth();
    const maxColumns = this.columns();
    return `repeat(auto-fit, minmax(min(${width}, calc(100% / ${maxColumns})), 1fr))`;
  }

  private assertAllowedChildren() {
    const grid = this.host.nativeElement.querySelector('.ux-summary-bar__grid');
    if (!grid) {
      return;
    }

    const children = Array.from(grid.children) as HTMLElement[];
    const invalidChildren = children.filter(
      child => child.tagName !== 'OFOQH-UX-SUMMARY-CARD'
    );

    if (invalidChildren.length === 0) {
      return;
    }

    const invalidTags = invalidChildren.map(child => child.tagName.toLowerCase()).join(', ');
    throw new Error(
      `ofoqh-ux-summary-bar accepts only ofoqh-ux-summary-card children. Found: ${invalidTags}.`
    );
  }
}
