import { Component, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-savings-rate-card',
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './savings-rate-card.html',
  styleUrl: './savings-rate-card.css',
})
export class SavingsRateCard {
  readonly income = input.required<number>();
  readonly expense = input.required<number>();
  readonly savingsRate = input.required<number>();
}
