import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { MerchantService } from '../src/merchant';
import { MerchantSoldByComponent } from './sold-by.component';
import { merchantSoldByComponent } from './sold-by.def';

class MockMerchantService implements Partial<MerchantService> {
  get = vi.fn();
}

describe('MerchantSoldByComponent', () => {
  let element: MerchantSoldByComponent;
  let merchantService: MockMerchantService;

  beforeAll(async () => {
    await useComponent(merchantSoldByComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: MerchantService,
          useClass: MockMerchantService,
        },
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
      ],
    });

    merchantService = injector.inject<MockMerchantService>(MerchantService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when a merchant is provided ', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(
        of({ id: '123', name: 'Merchant name' })
      );

      element = await fixture(
        html`<oryx-merchant-sold-by merchant="123"></oryx-merchant-sold-by>`
      );
    });

    it('should render the default prefix', () => {
      const el = element.shadowRoot?.querySelector('span');
      expect(el?.textContent).toContain('Sold by:');
    });

    it('should render merchant link options', () => {
      const el = element.shadowRoot?.querySelector('oryx-content-link');
      expect((el as any)?.options).toEqual({
        type: RouteType.Merchant,
        id: '123',
      });
      expect(el?.textContent).toContain('Merchant name');
    });
  });

  describe('when a custom prefix is provided ', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(
        of({ id: '123', name: 'Merchant name' })
      );

      element = await fixture(
        html`<oryx-merchant-sold-by
          merchant="123"
          .options=${{ prefix: 'abc-' }}
        ></oryx-merchant-sold-by>`
      );
    });

    it('should render the custom prefix', () => {
      const el = element.shadowRoot?.querySelector('span');
      expect(el?.textContent).toContain('abc-');
    });
  });

  describe('when no merchant is resolved ', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-sold-by
          merchant="123"
          .options=${{ prefix: 'abc-' }}
        ></oryx-merchant-sold-by>`
      );
    });

    it('should not render the custom prefix', () => {
      expect(element).not.toContainElement('span[part="prefix"]');
    });

    it('should not render a content link component', () => {
      expect(element).not.toContainElement('oryx-content-link');
    });
  });
});
