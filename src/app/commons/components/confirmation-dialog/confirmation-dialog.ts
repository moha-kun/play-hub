import {Component, EventEmitter, input, Output} from '@angular/core';

@Component({
  selector: 'confirmation-dialog',
  imports: [],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss',
})
export class ConfirmationDialog {
  title = input<string>();
  content = input<string>();
  @Output()
  close= new EventEmitter<string>();
  destroyEvent = new EventEmitter<void>();

  closeConfirm() {
    this.close.emit('reject');
    this.destroy();
  }

  confirmAction() {
    this.close.emit('accept');
    this.destroy();
  }

  destroy() {
    this.destroyEvent.emit();
  }
}
