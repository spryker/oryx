import {
  mockNormalizedPaymentMethods,
  mockPaymentMethods,
} from '@spryker-oryx/checkout/mocks';
import { DeserializedCheckout } from '../checkout';
import { paymentsNormalizer } from './payments.normalizer';

const mockCheckoutData: DeserializedCheckout = {
  addresses: [],
  paymentProviders: [],
  shipmentMethods: [],
  selectedShipmentMethods: [],
  selectedPaymentMethods: [],
  paymentMethods: mockPaymentMethods,
};

describe('Payments Normalizer', () => {
  it('should transform ApiCheckoutModel.PaymentMethods Include into CheckoutData', () => {
    const normalized = paymentsNormalizer(mockCheckoutData);
    expect(normalized).toEqual(mockNormalizedPaymentMethods);
  });
});
