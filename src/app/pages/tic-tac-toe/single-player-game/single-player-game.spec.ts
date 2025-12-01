import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePlayerGame } from './single-player-game';

describe('SinglePlayerGame', () => {
  let component: SinglePlayerGame;
  let fixture: ComponentFixture<SinglePlayerGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglePlayerGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglePlayerGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
