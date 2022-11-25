export enum CheckoutTrigger {
  Report = 'report',
  Check = 'check',
}

export enum Validity {
  Invalid = 'invalid',
  Valid = 'valid',
}

export enum CheckoutSteps {
  Delivery = 'delivery',
  Shipping = 'shipping',
  Payment = 'payment',
}

export type ValidityReport = {
  id: string;
  validity: Validity | undefined;
};

export const checkoutStepsConfig = [
  CheckoutSteps.Delivery,
  CheckoutSteps.Shipping,
  CheckoutSteps.Payment,
];
