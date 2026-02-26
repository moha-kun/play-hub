import {Component, input} from '@angular/core';
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

  private resolveFn!: (value: boolean) => void;

  open(): Promise<boolean> {
    return new Promise(resolve => this.resolveFn = resolve);
  }

  confirm() {
    this.resolveFn(true);
  }

  cancel() {
    this.resolveFn(false);
  }
}
