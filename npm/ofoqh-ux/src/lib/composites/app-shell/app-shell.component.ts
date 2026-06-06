import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { UxStatefulButtonComponent } from '../../primitives/stateful-button/stateful-button.component';

export type UxAppShellNavItem = {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
  badge?: number;
};

export type UxAppShellNavSection = {
  key: string;
  label: string;
  items: readonly UxAppShellNavItem[];
  collapsible?: boolean;
  collapsed?: boolean;
};

export type UxAppShellMetaCard = {
  label: string;
  title: string;
  lines?: readonly string[];
  monoLine?: string | null;
};

@Component({
  selector: 'ofoqh-ux-app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, UxStatefulButtonComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UxAppShellComponent {
  private readonly document = inject(DOCUMENT);
  private readonly debugStorageKey = 'ofoqh.ux.debug-enabled';

  @Input() navOpen = false;
  @Input() brandEyebrow = '';
  @Input() brandTitle = '';
  @Input() closeLabel = 'Close';
  @Input() menuLabel = 'Menu';
  @Input() topbarTitle = '';
  @Input() topbarSubtitle = '';
  @Input() attentionLabel: string | null = null;
  @Input() loading = false;
  @Input() metaLift = 28;
  @Input() metaGripAriaLabel = 'Move info cards';
  @Input() navSections: readonly UxAppShellNavSection[] = [];
  @Input() metaCards: readonly UxAppShellMetaCard[] = [];
  @Input() showDebugToggle = true;
  @Input() debugToggleOnLabel = 'UX on';
  @Input() debugToggleOffLabel = 'UX off';

  @Output() readonly closeNav = new EventEmitter<void>();
  @Output() readonly toggleNav = new EventEmitter<void>();
  @Output() readonly toggleSection = new EventEmitter<string>();
  @Output() readonly metaGripPointerDown = new EventEmitter<PointerEvent>();

  readonly debugEnabled = signal(this.loadDebugEnabled());

  constructor() {
    effect(() => {
      const root = this.document.documentElement;
      const enabled = this.debugEnabled();
      root.toggleAttribute('data-ux-debug', enabled);
      root.style.setProperty('--ux-debug-host-bg', enabled ? 'rgba(255, 238, 0, 0.34)' : 'transparent');
      root.style.setProperty('--ux-debug-outline-width', enabled ? '3px' : '0');
      root.style.setProperty('--ux-debug-outline-color', enabled ? '#ff00a8' : 'transparent');
      root.style.setProperty('--ux-debug-badge-display', enabled ? 'block' : 'none');
      root.style.setProperty('--ux-debug-badge-bg', '#ff00a8');
      root.style.setProperty('--ux-debug-badge-color', '#ffea00');
      root.style.setProperty('--ux-debug-badge-ring', '#ffea00');
      this.document.defaultView?.localStorage.setItem(this.debugStorageKey, enabled ? '1' : '0');
    });
  }

  toggleDebug() {
    this.debugEnabled.update(value => !value);
  }

  private loadDebugEnabled() {
    const raw = this.document.defaultView?.localStorage.getItem(this.debugStorageKey);
    if (raw === '0') return false;
    if (raw === '1') return true;
    return true;
  }
}
