export enum CheckoutTrigger {
  Report = 'report',
  Check = 'check',
}

export enum Validity {
  Invalid = 'invalid',
  Valid = 'valid',
}

export enum CheckoutStepType {
  Delivery = 'delivery',
  Shipping = 'shipping',
  Payment = 'payment',
}

export interface CheckoutStep {
  id: CheckoutStepType;
  label?: string;
}

export type ValidityReport = {
  id: CheckoutStepType;
  validity: Validity | undefined;
};

export type CheckoutConfiguration = CheckoutStep[];
