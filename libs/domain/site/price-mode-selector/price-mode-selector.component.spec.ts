import { fixture, html } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { PriceModeService } from '../src/services';
import { SitePriceModeSelectorComponent } from './price-mode-selector.component';
import { sitePriceModeSelectorComponent } from './price-mode-selector.def';

class MockPriceModeService implements Partial<PriceModeService> {
  get = vi.fn().mockReturnValue('GROSS_MODE');
  set = vi.fn();
}

describe('SitePriceModeSelectorComponent', () => {
  let element: SitePriceModeSelectorComponent;
  let priceModeService: MockPriceModeService;

  beforeAll(async () => {
    await useComponent([sitePriceModeSelectorComponent]);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: PriceModeService,
          useClass: MockPriceModeService,
        },
      ],
    });

    priceModeService = injector.inject(
      PriceModeService
    ) as unknown as MockPriceModeService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is initialized', () => {
    beforeEach(async () => {
      priceModeService.get.mockReturnValue('GROSS_MODE');
      element = await fixture(
        html`<oryx-price-mode-selector></oryx-price-mode-selector>`
      );
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(SitePriceModeSelectorComponent);
    });
  });

  describe('when the component renders the options', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-price-mode-selector></oryx-price-mode-selector>`
      );
    });

    it('should have only two options', () => {
      const options = element.shadowRoot?.querySelectorAll('oryx-option');
      expect(options?.length).toEqual(2);
    });

    it('should render the specific names', () => {
      const options = element.shadowRoot?.querySelectorAll('oryx-option');
      expect(options?.[0].textContent).toContain('GROSS MODE');
      expect(options?.[1].textContent).toContain('NET MODE');
    });

    it('selects the default option', () => {
      const options = element.shadowRoot?.querySelectorAll('oryx-option');

      expect(options?.[0].hasAttribute('active')).toBe(true);
      expect(options?.[1].hasAttribute('active')).toBe(false);
    });

    describe('when the price mode changes', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-price-mode-selector></oryx-price-mode-selector>`
        );

        const netModeOption = element.shadowRoot?.querySelector(
          'oryx-option[value=NET_MODE]'
        );

        netModeOption?.dispatchEvent(new Event('click'));
      });

      it('selects the correct option when the price mode changes', () => {
        expect(priceModeService.set).toHaveBeenCalledWith('NET_MODE');
      });
    });
  });
});
