export enum TotalsItem {
    Delivery = 'delivery',
    Discount = 'discount',
    Expense = 'expense',
    Subtotal = 'subtotal',
    Tax = 'tax',
    Total = 'total',
}

export interface TotalsItemOptions {
    type: TotalsItem;
} 