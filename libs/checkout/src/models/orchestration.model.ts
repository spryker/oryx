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

export type ValidityReport = {
  id: CheckoutStepType;
  validity: Validity | undefined;
};

// TODO: it will be more complex in the future
export type CheckoutConfiguration = CheckoutStepType[];
