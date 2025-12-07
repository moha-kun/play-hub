import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPlayerGame } from './multi-player-game.component';

describe('MultiplePlayerGame', () => {
  let component: MultiPlayerGame;
  let fixture: ComponentFixture<MultiPlayerGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiPlayerGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiPlayerGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
