import {ApplicationRef, createComponent, EmbeddedViewRef, EnvironmentInjector, Injectable} from '@angular/core';
import {ConfirmationDialog} from '../components/confirmation-dialog/confirmation-dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) {
  }

  open(options: {title: string, content: string}): Promise<boolean> {
    const dialog = createComponent(
      ConfirmationDialog,
      {
        environmentInjector: this.injector
      });
    dialog.setInput('title', options.title);
    dialog.setInput('content', options.content);

    this.appRef.attachView(dialog.hostView);
    dialog.changeDetectorRef.detectChanges();

    document.body.append((<EmbeddedViewRef<any>>dialog.hostView).rootNodes[0]);

    const promise = dialog.instance.open();

    promise.finally(() => {
      this.appRef.detachView(dialog.hostView);
      dialog.destroy();
    });

    return promise;
  }
}
