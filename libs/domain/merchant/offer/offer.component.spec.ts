import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { MerchantOfferComponent } from './offer.component';
import { merchantOfferComponent } from './offer.def';

describe.only('MerchantOfferComponent', () => {
  let element: MerchantOfferComponent;

  beforeAll(async () => {
    await useComponent(merchantOfferComponent);
  });

  beforeEach(async () => {
    createInjector({ providers: [...mockProductProviders] });
  });

  afterEach(() => destroyInjector());

  describe('when there is an offer', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-offer
          sku="mp-1"
          offerId="offer-1"
        ></oryx-merchant-offer>`
      );
    });

    it('should render the offer price', () => {
      expect(element).toContainElement('oryx-product-price');
    });

    it('should render the delivery time', () => {
      expect(element).toContainElement('.delivery-time');
    });

    it('should render the product availability', () => {
      expect(element).toContainElement('oryx-product-availability');
    });
  });

  describe('when the merchant has no delivery time', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-offer
          sku="mp-1"
          offerId="offer-2"
        ></oryx-merchant-offer>`
      );
    });

    it('should render the offer price', () => {
      expect(element).toContainElement('oryx-product-price');
    });

    it('should render the delivery time', () => {
      expect(element).not.toContainElement('.delivery-time');
    });

    it('should render the product availability', () => {
      expect(element).toContainElement('oryx-product-availability');
    });
  });

  describe('when there is no offer', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-offer
          sku="mp-1"
          offerId="unknown"
        ></oryx-merchant-offer>`
      );
    });

    it('should not render any content', () => {
      expect(element).not.toContainElement('*:not(style)');
    });
  });
});
