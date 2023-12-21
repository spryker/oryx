import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { LinkService } from '@spryker-oryx/site';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { MerchantOfferListComponent } from './offer-list.component';
import { merchantOfferListComponent } from './offer-list.def';

class MockLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of('/product/123'));
}

describe.skip('MerchantOfferListComponent', () => {
  let element: MerchantOfferListComponent;

  beforeAll(async () => {
    mockFeatureVersion('1.4');
    await useComponent(merchantOfferListComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...mockProductProviders,
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
        {
          provide: LinkService,
          useClass: MockLinkService,
        },
      ],
    });
  });

  afterEach(() => destroyInjector());

  describe('when the component is rendered', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-offer-list></oryx-merchant-offer-list>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when the product has offers', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-offer-list sku="mp-1"></oryx-merchant-offer-list>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render a link with radio input and offer-list-item for each offer', () => {
      expect(element).toContainElement(
        'a input[value="offer-1"] + oryx-merchant-offer-list-item'
      );
      expect(element).toContainElement(
        'a input[value="offer-2"] + oryx-merchant-offer-list-item'
      );
    });
  });

  describe('when the product has no offers', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-offer-list sku="1"></oryx-merchant-offer-list>`
      );
    });

    it('should not render anything', () => {
      expect(element).not.toContainElement('*:not(style)');
    });
  });
});
