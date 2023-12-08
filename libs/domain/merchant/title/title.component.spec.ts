import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouteType } from '@spryker-oryx/router';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { MerchantService } from '../src';
import { MerchantTitleComponent } from './title.component';
import { merchantTitleComponent } from './title.def';

class MockMerchantService implements Partial<MerchantService> {
  get = vi.fn();
}

describe('MerchantTitleComponent', () => {
  let element: MerchantTitleComponent;
  let merchantService: MockMerchantService;

  beforeAll(async () => {
    await useComponent(merchantTitleComponent);
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
        html`<oryx-merchant-title merchant="123"></oryx-merchant-title>`
      );
    });

    it('should not render a prefix by default', () => {
      expect(element).not.toContainElement('span[part="prefix"]');
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

  describe('when no merchant is resolved ', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-title merchant="123"></oryx-merchant-title>`
      );
    });

    it('should not render any elements', () => {
      expect(element).not.toContainElement('*');
    });
  });

  describe('when a custom prefix is provided ', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(
        of({ id: '123', name: 'Merchant name' })
      );

      element = await fixture(
        html`<oryx-merchant-title
          merchant="123"
          .options=${{ prefix: 'abc-' }}
        ></oryx-merchant-title>`
      );
    });

    it('should render the custom prefix', () => {
      const el = element.shadowRoot?.querySelector('span');
      expect(el?.textContent).toContain('abc-');
    });
  });

  describe('when link is false ', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(
        of({ id: '123', name: 'Merchant name' })
      );

      element = await fixture(
        html`<oryx-merchant-title
          merchant="123"
          .options=${{ link: false }}
        ></oryx-merchant-title>`
      );
    });

    it('should not render a content link component', () => {
      expect(element).not.toContainElement('oryx-content-link');
    });
  });

  describe('when link is true ', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(
        of({ id: '123', name: 'Merchant name' })
      );

      element = await fixture(
        html`<oryx-merchant-title
          merchant="123"
          .options=${{ link: true }}
        ></oryx-merchant-title>`
      );
    });

    it('should not render a content link component', () => {
      expect(element).toContainElement('oryx-content-link');
    });
  });
});
