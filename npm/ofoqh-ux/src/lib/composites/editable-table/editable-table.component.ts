import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChildren, Directive, Input, QueryList, TemplateRef } from '@angular/core';

export type EditableTableAlign = 'start' | 'center' | 'end';

export interface EditableTableColumn {
  id: string;
  header: string;
  width?: string;
  align?: EditableTableAlign;
}

export interface EditableTableCellContext<T> {
  $implicit: T;
  row: T;
  index: number;
  column: EditableTableColumn;
}

@Directive({
  standalone: true,
  selector: 'ng-template[ofoqhUxEditableCell], ng-template[idpEditableCell]',
})
export class EditableTableCellDefDirective<T = unknown> {
  @Input('ofoqhUxEditableCell') uxColumnId = '';
  @Input('idpEditableCell') legacyColumnId = '';

  constructor(readonly templateRef: TemplateRef<EditableTableCellContext<T>>) {}

  get columnId() {
    return this.uxColumnId || this.legacyColumnId;
  }
}

@Component({
  standalone: true,
  selector: 'ofoqh-ux-editable-table, idp-editable-table',
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './editable-table.component.html',
  styleUrl: './editable-table.component.scss',
})
export class EditableTableComponent<T = unknown> {
  @Input() columns: readonly EditableTableColumn[] = [];
  @Input() rows: readonly T[] = [];
  @Input() rowTrackBy?: (index: number, row: T) => string | number;

  @ContentChildren(EditableTableCellDefDirective)
  private readonly cellDefs!: QueryList<EditableTableCellDefDirective<T>>;

  gridTemplateColumns(): string {
    return this.columns.map(c => c.width ?? '1fr').join(' ');
  }

  rowIdentity(index: number, row: T): string | number | T {
    return this.rowTrackBy ? this.rowTrackBy(index, row) : row;
  }

  cellTemplate(columnId: string): TemplateRef<EditableTableCellContext<T>> | null {
    const defs = this.cellDefs?.toArray() ?? [];
    const def = defs.find(d => d.columnId === columnId);
    return def?.templateRef ?? null;
  }

  cellContext(row: T, index: number, column: EditableTableColumn): EditableTableCellContext<T> {
    return { $implicit: row, row, index, column };
  }
}
