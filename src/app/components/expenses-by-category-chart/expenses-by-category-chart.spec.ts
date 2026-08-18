import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesByCategoryChart } from './expenses-by-category-chart';

describe('ExpensesByCategoryChart', () => {
  let component: ExpensesByCategoryChart;
  let fixture: ComponentFixture<ExpensesByCategoryChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesByCategoryChart],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesByCategoryChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
