import {
  mockNormalizedPaymentMethods,
  mockPaymentMethods,
} from '@spryker-oryx/checkout/mocks';
import { DeserializedCheckout } from './model';
import { paymentsNormalizer } from './payments.normalizer';

const mockCheckoutData: DeserializedCheckout = {
  addresses: [],
  paymentProviders: [],
  shipmentMethods: [],
  selectedShipmentMethods: [],
  selectedPaymentMethods: [],
  paymentMethods: mockPaymentMethods,
};

describe('paymentsNormalizer', () => {
  describe('when no data is provided', () => {
    it('should return an empty array', () => {
      expect(paymentsNormalizer()).toEqual([]);
    });
  });

  describe('when valid data is provided', () => {
    it('should transform ApiCheckoutModel.PaymentMethods Include into CheckoutData', () => {
      const normalized = paymentsNormalizer(mockCheckoutData);
      expect(normalized).toEqual(mockNormalizedPaymentMethods);
    });
  });
});
