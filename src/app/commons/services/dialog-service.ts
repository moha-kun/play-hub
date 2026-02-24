import {ApplicationRef, createComponent, EmbeddedViewRef, Injectable} from '@angular/core';
import {ConfirmationDialog} from '../components/confirmation-dialog/confirmation-dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private appRef: ApplicationRef) {
  }

  open(options: {title: string, content: string}) {
    const dialog = createComponent(
      ConfirmationDialog,
      {
        environmentInjector: this.appRef.injector
      });
    dialog.setInput('title', options.title);
    dialog.setInput('content', options.content);

    this.appRef.attachView(dialog.hostView);
    dialog.changeDetectorRef.detectChanges();

    document.body.append((<EmbeddedViewRef<any>>dialog.hostView).rootNodes[0]);

    dialog.instance.destroyEvent.subscribe(() => {
      this.appRef.detachView(dialog.hostView);
      dialog.destroy();
    })
    return dialog.instance.close;
  }
}
