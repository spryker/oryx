import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { MerchantOfferListItemComponent } from './offer-list-item.component';
import { merchantOfferListItemComponent } from './offer-list-item.def';

describe('MerchantOfferListItemComponent', () => {
  let element: MerchantOfferListItemComponent;

  beforeAll(async () => {
    await useComponent(merchantOfferListItemComponent);
  });

  beforeEach(async () => {
    createInjector({ providers: [...mockProductProviders] });
  });

  afterEach(() => destroyInjector());

  describe('when the component is rendered', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-offer-list-item></oryx-merchant-offer-list-item>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when there is an offer for the given offerId', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-offer-list-item
          sku="mp-1"
          offerId="offer-1"
        ></oryx-merchant-offer-list-item>`
      );
    });

    it('should render the offer details', () => {
      expect(element).toContainElement('oryx-heading');
      expect(element).toContainElement('oryx-product-price');
      expect(element).toContainElement('.delivery-time');
      expect(element).toContainElement('oryx-product-availability');
    });
  });

  describe('when the offer Id is not available for the given sku', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-offer-list-item
          sku="mp-1"
          offerId="unknown"
        ></oryx-merchant-offer-list-item>`
      );
    });

    it('should not render any content', () => {
      expect(element).not.toContainElement('*:not(style)');
    });
  });
});
