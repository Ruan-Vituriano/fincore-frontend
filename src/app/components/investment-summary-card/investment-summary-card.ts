import { Component, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-investment-summary-card',
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './investment-summary-card.html',
  styleUrl: './investment-summary-card.css',
})
export class InvestmentSummaryCard {
  readonly totalInvested = input.required<number>();
  readonly totalCurrentValue = input.required<number>();
  readonly returnPercentage = input.required<number>();
}
