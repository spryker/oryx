import { fixture, html } from '@open-wc/testing-helpers';
import { destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { SitePriceModeSelectorComponent } from './price-mode-selector.component';
import { sitePriceModeSelectorComponent } from './price-mode-selector.def';

describe('SiteCurrencySelectorComponent', () => {
  let element: SitePriceModeSelectorComponent;

  beforeAll(async () => {
    await useComponent([sitePriceModeSelectorComponent]);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when the component is initialized', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-price-mode-selector></oryx-price-mode-selector>`
      );
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(SitePriceModeSelectorComponent);
    });
  });
});
