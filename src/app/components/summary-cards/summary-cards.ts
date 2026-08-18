import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-summary-cards',
  imports: [CurrencyPipe],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.css',
})
export class SummaryCards {
  readonly income = input.required<number>();
  readonly expense = input.required<number>();
  readonly balance = input.required<number>();
}
