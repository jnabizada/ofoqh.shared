import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ofoqh-ux-editor-shell',
  standalone: true,
  templateUrl: './editor-shell.component.html',
  styleUrl: './editor-shell.component.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-ux-component': 'editor-shell',
    '[class.ux-editor-shell-host--span-2]': 'spanTwo',
  },
})
export class UxEditorShellComponent {
  @Input() title = '';
  @Input() subhead = '';
  @Input() spanTwo = false;

  @Input() showRemove = false;
  @Input() removeLabel = 'Remove';
  @Input() removeBusyLabel = 'Removing';
  @Input() removeBusy = false;
  @Input() removeDisabled = false;

  @Input() showSave = true;
  @Input() saveLabel = 'Save';
  @Input() saveDisabled = false;

  @Output() readonly remove = new EventEmitter<void>();
  @Output() readonly save = new EventEmitter<void>();
}
