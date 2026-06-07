import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ofoqh-ux-filter-shell',
  standalone: true,
  templateUrl: './filter-shell.component.html',
  styleUrl: './filter-shell.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: { 'data-ux-component': 'filter-shell' },
})
export class UxFilterShellComponent {
  @Input() summaryText = '';
  @Input() shownTag = '';
  @Input() showReset = true;
  @Input() resetLabel = 'Reset filters';

  @Output() readonly reset = new EventEmitter<void>();
}
