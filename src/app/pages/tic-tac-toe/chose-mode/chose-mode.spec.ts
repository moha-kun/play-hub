import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoseMode } from './chose-mode';

describe('ChoseMode', () => {
  let component: ChoseMode;
  let fixture: ComponentFixture<ChoseMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoseMode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoseMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
