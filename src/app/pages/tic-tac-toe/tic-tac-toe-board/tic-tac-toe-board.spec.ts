import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicTacToeBoard } from './tic-tac-toe-board';

describe('TicTacToeBoard', () => {
  let component: TicTacToeBoard;
  let fixture: ComponentFixture<TicTacToeBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicTacToeBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicTacToeBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
