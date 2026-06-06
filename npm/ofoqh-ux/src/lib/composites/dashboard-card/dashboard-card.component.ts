import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';

export type UxDashboardCardColorOption = {
  value: string;
  label: string;
};

export type UxDashboardCardWidthOption = {
  value: string;
  label: string;
};

@Component({
  selector: 'ofoqh-ux-dashboard-card',
  standalone: true,
  imports: [CdkDrag],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UxDashboardCardComponent {
  protected dragTemporarilyDisabled = false;

  @HostBinding('style.display') protected readonly hostDisplay = 'block';
  @HostBinding('style.max-width') protected readonly hostMaxWidth = '100%';
  @HostBinding('style.flex')
  protected get hostFlex() {
    return `1 1 ${this.minWidth}`;
  }

  @HostBinding('style.min-width')
  protected get hostMinWidth() {
    return `min(100%, ${this.minWidth})`;
  }

  @Input() title = '';
  @Input() subhead = '';
  @Input() eyebrow: string | null = null;
  @Input() wide = false;
  @Input() hero = false;
  @Input() minWidth = '360px';
  @Input() background = '';
  @Input() accentColor = '';
  @Input() menuOpen = false;
  @Input() quickColors: readonly UxDashboardCardColorOption[] = [];
  @Input() widthOptions: readonly UxDashboardCardWidthOption[] = [];
  @Input() currentWidthLabel = 'Standard';
  @Input() startsNewRow = false;
  @Input() colorPickerValue = '#7a889a';
  @Input() dragData: unknown = null;

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() hideCard = new EventEmitter<void>();
  @Output() colorChange = new EventEmitter<string>();
  @Output() widthChange = new EventEmitter<string>();
  @Output() rowBreakToggle = new EventEmitter<void>();

  protected onColorInput(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (target?.value) {
      this.colorChange.emit(target.value);
    }
  }

  protected onPointerDown(event: MouseEvent | TouchEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    if (target.closest('button, a, input, select, textarea, label, .ux-dashboard-card-menu')) {
      this.dragTemporarilyDisabled = true;
      queueMicrotask(() => {
        this.dragTemporarilyDisabled = false;
      });
    }
  }
}
