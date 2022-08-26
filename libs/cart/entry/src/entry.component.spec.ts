import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { mockCartProviders } from '@spryker-oryx/cart';
import * as core from '@spryker-oryx/core';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { ProductContext, ProductService } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { siteProviders } from '@spryker-oryx/site';
import '@spryker-oryx/testing';
import { IconComponent } from '@spryker-oryx/ui/icon';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { cartEntryComponent } from './component';
import { CartEntryOptionsComponent } from './components';
import { CartEntryContentComponent } from './components/content';
import { CartEntryComponent } from './entry.component';
import { CartEntryCompositionOptions } from './entry.model';

const mockContext = {
  get: vi.fn().mockReturnValue(of('mockSku')),
  provide: vi.fn(),
};
vi.spyOn(core, 'ContextController') as SpyInstance;
(core.ContextController as unknown as SpyInstance).mockReturnValue(mockContext);

describe('CartEntryComponent', () => {
  let element: CartEntryComponent;
  const product = MockProductService.mockProducts[0];
  const sku = product.sku as string;

  const options = { sku, quantity: 1 };

  const getCurrentOptions = (): CartEntryCompositionOptions | void => {
    const component = element.renderRoot.querySelector(
      'cart-entry-content'
    ) as CartEntryContentComponent;
    return component.options;
  };

  const getPart = <T = Element>(selector: string): T => {
    return element.renderRoot.querySelector(selector) as unknown as T;
  };

  beforeAll(async () => {
    await useComponent(cartEntryComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...siteProviders,
        ...mockCartProviders,
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
      ],
    });
    element = await fixture(html` <cart-entry
      .options=${options}
    ></cart-entry>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('providing the context', () => {
    const sku = 'sku';

    it('should provide sku from the options', async () => {
      await fixture(html`<cart-entry .options="${{ sku }}"></cart-entry>`);

      expect(mockContext.provide).toHaveBeenCalledWith(ProductContext.SKU, sku);
    });
  });

  describe('"hidePreview" option', () => {
    describe('when option is not provided', () => {
      it('should render product-media', () => {
        expect(element).toContainElement('product-media');
      });
    });

    describe('when option is provided', () => {
      beforeEach(async () => {
        element = await fixture(html` <cart-entry
          .options=${{ sku, hidePreview: true }}
        ></cart-entry>`);
      });
      it('should not render product-media', () => {
        expect(element).not.toContainElement('product-media');
      });
    });
  });

  describe('"removeButtonIcon" option', () => {
    describe('when option is not provided', () => {
      it('should set default icon type', () => {
        expect(getPart<IconComponent>('oryx-icon-button oryx-icon').type).toBe(
          'close'
        );
      });
    });

    describe('when option is provided', () => {
      const removeButtonIcon = 'trash';

      beforeEach(async () => {
        element = await fixture(html` <cart-entry
          .options=${{ sku, removeButtonIcon }}
        ></cart-entry>`);
      });
      it('should set custom icon type', () => {
        expect(getPart<IconComponent>('oryx-icon-button oryx-icon').type).toBe(
          removeButtonIcon
        );
      });
    });
  });

  describe('when no "selectedProductOptions"', () => {
    it('should not render the section', () => {
      expect(element).not.toContainElement('cart-entry-options');
    });
  });

  describe('when "selectedProductOptions" is provided', () => {
    beforeEach(async () => {
      element = await fixture(html` <cart-entry
        .options=${{ ...options, selectedProductOptions: [{}] }}
      ></cart-entry>`);
    });

    it('should render the section', () => {
      expect(element).toContainElement('cart-entry-options');
    });

    describe('when options toggled', () => {
      beforeEach(() => {
        getPart('cart-entry-options')?.dispatchEvent(
          new CustomEvent('toggle', { detail: { state: true } })
        );
      });

      it('should set "show-options" attribute', async () => {
        await elementUpdated(element);
        expect(
          getPart<CartEntryOptionsComponent>('cart-entry-options').hasAttribute(
            'show-options'
          )
        ).toBe(true);
      });
    });
  });

  describe('when quantity is changed', () => {
    const callback = vi.fn();

    beforeEach(async () => {
      element = await fixture(html` <cart-entry
        .options=${options}
        @oryx.remove=${callback}
      ></cart-entry>`);

      getPart('cart-entry-content')?.dispatchEvent(
        new CustomEvent('oryx.quantity', { detail: { quantity: 2 } })
      );
    });

    it('should not dispatch @oryx.remove event', () => {
      expect(callback).not.toHaveBeenCalled();
    });

    describe('and quantity is equal 0', () => {
      const callback = vi.fn();

      beforeEach(async () => {
        element = await fixture(html` <cart-entry
          .options=${options}
          @oryx.remove=${callback}
        ></cart-entry>`);

        getPart('cart-entry-content')?.dispatchEvent(
          new CustomEvent('oryx.quantity', { detail: { quantity: 0 } })
        );
      });

      it('should set "disabled" attribute', () => {
        expect(
          getPart<CartEntryContentComponent>('cart-entry-content').hasAttribute(
            'disabled'
          )
        ).toBe(true);
      });

      it('should not dispatch @oryx.remove event', () => {
        expect(callback).not.toHaveBeenCalled();
      });

      describe('when "silentRemove" option provided', () => {
        const callback = vi.fn();

        beforeEach(async () => {
          element = await fixture(html` <cart-entry
            .options=${{ ...options, silentRemove: true }}
            @oryx.remove=${callback}
          ></cart-entry>`);

          getPart('cart-entry-content')?.dispatchEvent(
            new CustomEvent('oryx.quantity', { detail: { quantity: 0 } })
          );
        });

        it('should dispatch @oryx.remove event', () => {
          expect(callback).toHaveBeenCalled();
        });
      });
    });
  });

  describe('removing', () => {
    describe('when confirmation is not required', () => {
      const callback = vi.fn();

      beforeEach(async () => {
        element = await fixture(html` <cart-entry
          .options=${options}
          @oryx.remove=${callback}
        ></cart-entry>`);
      });

      it('should render the button', () => {
        expect(element).toContainElement('oryx-icon-button button');
      });

      it('should not render the confirmation', () => {
        expect(element).not.toContainElement('cart-entry-confirmation');
      });

      describe('and the button is clicked', () => {
        beforeEach(() => {
          getPart<HTMLButtonElement>('oryx-icon-button button')?.click();
        });

        it('should render the confirmation', () => {
          expect(element).toContainElement('cart-entry-confirmation');
        });

        it('should not dispatch @oryx.remove event', () => {
          expect(callback).not.toHaveBeenCalled();
        });
      });

      describe('and the button is clicked with "silentRemove"', () => {
        beforeEach(async () => {
          element = await fixture(html` <cart-entry
            .options=${{ ...options, silentRemove: true }}
            @oryx.remove=${callback}
          ></cart-entry>`);

          getPart<HTMLButtonElement>('oryx-icon-button button')?.click();
        });

        it('should dispatch @oryx.remove event', () => {
          expect(callback).toHaveBeenCalled();
        });
      });
    });

    describe('when confirmation is required', () => {
      const callback = vi.fn();

      beforeEach(async () => {
        element = await fixture(html` <cart-entry
          .options=${{ ...options }}
          @oryx.remove=${callback}
        ></cart-entry>`);

        getPart<HTMLButtonElement>('oryx-icon-button button')?.click();
      });

      it('should not render the button', () => {
        expect(element).not.toContainElement('oryx-icon-button button');
      });

      it('should render the confirmation', () => {
        expect(element).toContainElement('cart-entry-confirmation');
      });

      describe('and removing is confirmed', () => {
        beforeEach(() => {
          getPart('cart-entry-confirmation')?.dispatchEvent(
            new CustomEvent('remove')
          );
        });

        it('should dispatch @oryx.remove event', () => {
          expect(callback).toHaveBeenCalled();
        });
      });

      describe('and removing is cancelled', () => {
        beforeEach(() => {
          getPart('cart-entry-confirmation')?.dispatchEvent(
            new CustomEvent('cancel')
          );
        });

        it('should remove "disabled" attribute', () => {
          expect(
            getPart<CartEntryContentComponent>(
              'cart-entry-content'
            ).hasAttribute('disabled')
          ).toBe(false);
        });
      });
    });
  });
});
