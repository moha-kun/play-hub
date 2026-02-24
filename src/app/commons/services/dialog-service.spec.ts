import { TestBed } from '@angular/core/testing';

import { DialogService } from './dialog-service';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a dialog when it is called', () => {
    service.open({title: 'title', content: 'content'});

    const dialog = document.getElementById('confirmation_dialog');
    console.log(dialog);
    expect(dialog).toBeTruthy();

    const dialogTitle = document.querySelector('#confirmation_dialog .modal-title');
    expect(dialogTitle?.textContent).toEqual('title');

    const dialogContent = document.querySelector('#confirmation_dialog .modal-body p');
    expect(dialogContent?.textContent).toEqual('content');
  });
});
