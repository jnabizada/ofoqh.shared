import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UX_TRANSLATE } from '../../i18n/ux-i18n';

export type DataTableAlign = 'start' | 'center' | 'end';
export type DataTableColumnType = 'text' | 'link' | 'chips' | 'actions' | 'checkbox';
export type DataTableChipTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type DataTableSortDirection = 'asc' | 'desc' | '';

export interface DataTableTextCell {
  primary: string;
  secondary?: string;
}

export interface DataTableLinkCell {
  label: string;
}

export interface DataTableChipCell {
  label: string;
  tone?: DataTableChipTone;
}

export interface DataTableCheckboxCell {
  checked: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface DataTableAction {
  id: string;
  icon: string;
  tooltip?: string;
  disabled?: boolean;
}

export interface DataTableColumn<T> {
  id: string;
  header: string;
  type: DataTableColumnType;
  width?: string;
  align?: DataTableAlign;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | boolean | Date | null | undefined;
  text?: (row: T) => DataTableTextCell;
  link?: (row: T) => DataTableLinkCell;
  chips?: (row: T) => readonly DataTableChipCell[];
  checkbox?: (row: T) => DataTableCheckboxCell;
  actions?: (row: T) => readonly DataTableAction[];
}

export interface DataTableActionEvent<T> {
  actionId: string;
  row: T;
  columnId: string;
}

export interface DataTableLinkEvent<T> {
  row: T;
  columnId: string;
}

export interface DataTableCheckboxEvent<T> {
  checked: boolean;
  row: T;
  columnId: string;
}

export interface DataTableSortEvent {
  columnId: string;
  direction: DataTableSortDirection;
}

@Component({
  standalone: true,
  selector: 'ofoqh-ux-data-table, idp-data-table',
  imports: [CommonModule, MatCheckboxModule, MatIconModule, MatButtonModule, MatTooltipModule, MatPaginatorModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  host: { 'data-ux-component': 'data-table' },
})
export class DataTableComponent<T = unknown> implements OnChanges, AfterViewInit {
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly translate = inject(UX_TRANSLATE);

  @Input() columns: readonly DataTableColumn<T>[] = [];
  @Input() rows: readonly T[] = [];
  @Input() rowTrackBy?: (index: number, row: T) => string | number;
  @Input() emptyStateLabel = '';

  @Input() enablePagination = true;
  @Input() enableSorting = true;
  @Input() serverSorting = false;
  @Input() serverPagination = false;
  @Input() totalItems = 0;
  @Input() pageIndex = 0;
  @Input() pageSize = 20;
  @Input() pageSizeOptions: readonly number[] = [10, 20, 50, 100];
  @Input() autoPageSize = false;
  @Input() autoPageSizeMin = 10;
  @Input() autoPageSizeMax = 100;
  @Input() autoPageSizeRowHeight = 44;
  @Input() autoPageSizeBottomOffset = 170;
  @Input() paginatorThreshold = 0;

  @Output() actionTriggered = new EventEmitter<DataTableActionEvent<T>>();
  @Output() checkboxToggled = new EventEmitter<DataTableCheckboxEvent<T>>();
  @Output() linkTriggered = new EventEmitter<DataTableLinkEvent<T>>();
  @Output() pageChanged = new EventEmitter<PageEvent>();
  @Output() sortChanged = new EventEmitter<DataTableSortEvent>();

  private readonly clientPageIndex = signal(0);
  private readonly clientPageSize = signal(20);
  private readonly sortColumnId = signal<string>('');
  private readonly sortDirection = signal<DataTableSortDirection>('');

  resolvedPageIndex(): number {
    return this.serverPagination ? this.pageIndex : this.clientPageIndex();
  }

  resolvedPageSize(): number {
    return this.serverPagination ? this.pageSize : this.clientPageSize();
  }

  resolvedLength(): number {
    return this.serverPagination ? this.totalItems : this.rows.length;
  }

  showPaginator(): boolean {
    const minCount = Math.max(this.resolvedPageSize(), this.paginatorThreshold);
    return this.enablePagination && this.resolvedLength() > minCount;
  }

  visibleRows(): readonly T[] {
    const source = this.sortedRows();
    if (!this.enablePagination || this.serverPagination) {
      return source;
    }

    const size = this.resolvedPageSize();
    const start = this.resolvedPageIndex() * size;
    return source.slice(start, start + size);
  }

  resolvedEmptyStateLabel(): string {
    return this.emptyStateLabel.trim() || this.translate('ux.dataTable.emptyState', 'No items found');
  }

  isColumnSortable(col: DataTableColumn<T>): boolean {
    if (!this.enableSorting) {
      return false;
    }
    if (col.sortable === false) {
      return false;
    }
    return col.type !== 'actions' && col.type !== 'checkbox';
  }

  sortIcon(columnId: string): string {
    if (this.sortColumnId() !== columnId || !this.sortDirection()) {
      return 'unfold_more';
    }
    return this.sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  toggleSort(columnId: string): void {
    if (this.sortColumnId() !== columnId) {
      this.sortColumnId.set(columnId);
      this.sortDirection.set('asc');
    } else if (this.sortDirection() === 'asc') {
      this.sortDirection.set('desc');
    } else if (this.sortDirection() === 'desc') {
      this.sortDirection.set('');
      this.sortColumnId.set('');
    } else {
      this.sortDirection.set('asc');
    }

    const event: DataTableSortEvent = {
      columnId: this.sortColumnId(),
      direction: this.sortDirection(),
    };

    if (this.serverSorting) {
      this.sortChanged.emit(event);
      return;
    }

    if (!this.serverPagination) {
      this.clientPageIndex.set(0);
    }
  }

  trackRow(index: number, row: T): string | number | T {
    return this.rowTrackBy ? this.rowTrackBy(index, row) : row;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.autoPageSize) {
      this.applyAutoPageSize();
    }

    if (this.serverPagination) {
      return;
    }

    if (changes['pageSize'] && typeof this.pageSize === 'number' && this.pageSize > 0) {
      this.clientPageSize.set(this.pageSize);
      this.clientPageIndex.set(0);
    }

    const maxPageIndex = Math.max(0, Math.ceil(this.rows.length / this.clientPageSize()) - 1);
    if (this.clientPageIndex() > maxPageIndex) {
      this.clientPageIndex.set(maxPageIndex);
    }
  }

  ngAfterViewInit(): void {
    this.applyAutoPageSize();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.applyAutoPageSize();
  }

  emitAction(columnId: string, actionId: string, row: T): void {
    this.actionTriggered.emit({ actionId, row, columnId });
  }

  emitLink(columnId: string, row: T): void {
    this.linkTriggered.emit({ row, columnId });
  }

  emitCheckbox(columnId: string, row: T, checked: boolean): void {
    this.checkboxToggled.emit({ checked, row, columnId });
  }

  onPage(event: PageEvent): void {
    if (!this.serverPagination) {
      this.clientPageIndex.set(event.pageIndex);
      this.clientPageSize.set(event.pageSize);
    }
    this.pageChanged.emit(event);
  }

  private sortedRows(): readonly T[] {
    if (!this.enableSorting || this.serverSorting) {
      return this.rows;
    }

    const columnId = this.sortColumnId();
    const direction = this.sortDirection();
    if (!columnId || !direction) {
      return this.rows;
    }

    const column = this.columns.find(c => c.id === columnId);
    if (!column || !this.isColumnSortable(column)) {
      return this.rows;
    }

    const factor = direction === 'asc' ? 1 : -1;
    return [...this.rows].sort((a, b) => {
      const av = this.resolveSortValue(column, a);
      const bv = this.resolveSortValue(column, b);
      return this.compareSortValues(av, bv) * factor;
    });
  }

  private resolveSortValue(column: DataTableColumn<T>, row: T): string | number | boolean | Date | null | undefined {
    if (column.sortValue) {
      return column.sortValue(row);
    }
    if (column.type === 'text') {
      return column.text?.(row)?.primary ?? '';
    }
    if (column.type === 'link') {
      return column.link?.(row)?.label ?? '';
    }
    if (column.type === 'chips') {
      return column.chips?.(row)?.[0]?.label ?? '';
    }
    return '';
  }

  private compareSortValues(
    a: string | number | boolean | Date | null | undefined,
    b: string | number | boolean | Date | null | undefined,
  ): number {
    if (a == null && b == null) {
      return 0;
    }
    if (a == null) {
      return -1;
    }
    if (b == null) {
      return 1;
    }

    const av = a instanceof Date ? a.getTime() : typeof a === 'boolean' ? Number(a) : a;
    const bv = b instanceof Date ? b.getTime() : typeof b === 'boolean' ? Number(b) : b;

    if (typeof av === 'number' && typeof bv === 'number') {
      return av - bv;
    }

    return String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
  }

  private applyAutoPageSize(): void {
    if (!this.autoPageSize || typeof window === 'undefined') {
      return;
    }

    const host = this.hostRef.nativeElement;
    const rect = host.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const available = Math.max(0, viewportHeight - rect.top - this.autoPageSizeBottomOffset);
    const computedRows = Math.floor(available / Math.max(1, this.autoPageSizeRowHeight));
    const nextSize = Math.min(this.autoPageSizeMax, Math.max(this.autoPageSizeMin, computedRows || this.autoPageSizeMin));

    if (this.serverPagination) {
      if (nextSize !== this.pageSize) {
        this.pageChanged.emit({
          pageIndex: 0,
          pageSize: nextSize,
          length: this.resolvedLength(),
          previousPageIndex: this.pageIndex,
        });
      }
      return;
    }

    if (this.clientPageSize() !== nextSize) {
      this.clientPageSize.set(nextSize);
      this.clientPageIndex.set(0);
    }
  }
}
