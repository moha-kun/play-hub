import {Component, EventEmitter, input, Output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'confirmation-dialog',
  imports: [
    TranslatePipe
  ],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss',
})
export class ConfirmationDialog {
  title = input<string>();
  content = input<string>();
  @Output()
  onConfirm= new EventEmitter<void>();
  onDestroy = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
    this.destroy();
  }

  cancel() {
    this.destroy();
  }

  destroy() {
    this.onDestroy.emit();
  }
}
