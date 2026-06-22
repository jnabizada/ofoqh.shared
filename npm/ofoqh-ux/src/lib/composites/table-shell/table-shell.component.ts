import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ofoqh-ux-panel-shell, ofoqh-ux-table-shell',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './table-shell.component.html',
  styleUrl: './table-shell.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-ux-component': 'panel-shell',
    '[class.ux-table-shell-host--span-2]': 'spanTwo',
  },
})
export class UxPanelShellComponent {
  @Input() title = '';
  @Input() subhead = '';
  @Input() spanTwo = false;
  @Input() countTag = '';
  @Input() showPager = false;
  @Input() pageLabel = '';
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() pageSize = 5;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input() previousDisabled = false;
  @Input() nextDisabled = false;
  @Input() perPageLabel = 'Per page';
  @Input() previousLabel = 'Previous';
  @Input() nextLabel = 'Next';
  @Input() pagePrefix = 'Page';

  @Output() readonly previous = new EventEmitter<void>();
  @Output() readonly next = new EventEmitter<void>();
  @Output() readonly pageSizeChange = new EventEmitter<number>();
}

export { UxPanelShellComponent as UxTableShellComponent };
