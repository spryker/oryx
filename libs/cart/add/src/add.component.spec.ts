import { fixture, html, nextFrame } from '@open-wc/testing-helpers';
import { CartService, quantityInputComponent } from '@spryker-oryx/cart';
import {
  QuantityEventDetail,
  QuantityInputComponent,
} from '@spryker-oryx/cart/quantity-input';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { ProductService } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { wait } from '@spryker-oryx/typescript-utils';
import { buttonComponent } from '@spryker-oryx/ui';
import { delay, map, of } from 'rxjs';
import { CartAddComponent } from './add.component';
import { addToCartComponent } from './add.def';

class MockCartService implements Partial<CartService> {
  addEntry = vi.fn().mockReturnValue(of(null).pipe(delay(1)));
  getEntries = vi.fn().mockReturnValue(of([]));
}

describe('CartAddComponent', () => {
  let element: CartAddComponent;
  let service: Partial<MockCartService>;

  beforeAll(async () => {
    await useComponent([
      quantityInputComponent,
      buttonComponent,
      addToCartComponent,
    ]);
  });

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: ProductService,
          useClass: MockProductService,
        },
      ],
    });

    service = testInjector.inject(CartService) as unknown as MockCartService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when a correct sku is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-cart-add sku="1"></oryx-cart-add>`);
    });

    it('pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should have an quantity element', () => {
      expect(element).toContainElement('oryx-cart-quantity-input');
    });

    it('should have an button element', () => {
      expect(element).toContainElement('oryx-button');
    });
  });

  describe('when an incorrect sku is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-cart-add sku="foo"></oryx-cart-add>`);
    });

    it('pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should not have a quantity element', () => {
      expect(element).not.toContainElement('oryx-cart-quantity-input');
    });

    it('should not have a submit button', () => {
      expect(element).not.toContainElement('oryx-button');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-cart-add sku="1"></oryx-cart-add>`);
    });

    describe('when the quantity is enabled', () => {
      it('should enable the button', () => {
        expect(element).toContainElement('button:not([disabled])');
      });

      describe('and when an update is dispatched with an invalid quantity', () => {
        beforeEach(() => {
          const input = element.shadowRoot?.querySelector(
            'oryx-cart-quantity-input'
          );
          input?.dispatchEvent(
            new CustomEvent<QuantityEventDetail>('update', {
              detail: { quantity: 5, isInvalid: true },
            })
          );
        });

        it('should disable the button', () => {
          expect(element).toContainElement('button[disabled]');
        });
      });
    });
  });

  describe('submit', () => {
    describe('when the quantity input is used', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-cart-add sku="1"></oryx-cart-add>`);
      });

      describe('when the submit event is received from the quantity component', () => {
        beforeEach(() => {
          const input = element.shadowRoot?.querySelector(
            'oryx-cart-quantity-input'
          );
          input?.dispatchEvent(
            new CustomEvent<QuantityEventDetail>('submit', {
              detail: { quantity: 5 },
            })
          );
        });

        it('should add to cart', () => {
          expect(service.addEntry).toHaveBeenCalledWith({
            sku: '1',
            quantity: 5,
          });
        });
      });

      describe('when the item is added to cart', () => {
        beforeEach(() => {
          const button = element.shadowRoot?.querySelector('button');
          button?.click();
        });

        it('should call "addEntry" cart service method', () => {
          expect(service.addEntry).toHaveBeenCalledWith({
            sku: '1',
            quantity: 1,
          });
        });

        it('should have the button in disabled state', () => {
          expect(element).toContainElement('button[disabled]');
        });

        it('should have the oryx-button in loading state', () => {
          expect(element).toContainElement('oryx-button[loading]');
        });

        describe('and after the item is added', () => {
          beforeEach(async () => {
            await nextFrame();
          });

          it('should no longer have the button in disabled state', () => {
            expect(element).toContainElement('button[disabled]');
          });

          it('should no longer have the oryx-button in loading state', () => {
            expect(element).toContainElement('oryx-button:not([loading])');
          });

          it('should have the oryx-button in confirmed state', () => {
            expect(element).toContainElement('oryx-button[confirmed]');
          });

          describe('and when 800ms passed', () => {
            beforeEach(async () => {
              await wait(800);
            });

            it('should no longer have the oryx-button in confirmed state', () => {
              expect(element).toContainElement('oryx-button:not([confirmed])');
            });
          });
        });
      });
    });

    describe('when the quantity input is not used', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-add
            sku="1"
            .options=${{ hideQuantityInput: true }}
          ></oryx-cart-add>`
        );
      });

      describe('and when the item is added to cart', () => {
        beforeEach(() => {
          const button = element.shadowRoot?.querySelector('button');
          button?.click();
        });

        it('should call "addEntry" cart service method', () => {
          expect(service.addEntry).toHaveBeenCalledWith({
            sku: '1',
            quantity: 1,
          });
        });
      });
    });
  });

  describe('hideQuantityInput', () => {
    describe('when "hideQuantityInput" is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-cart-add sku="1"></oryx-cart-add>`);
      });

      it('should render quantity controls', () => {
        expect(element).toContainElement('oryx-cart-quantity-input');
      });
    });

    describe('when "hideQuantityInput" is true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-cart-add
            sku="1"
            .options=${{ hideQuantityInput: true }}
          ></oryx-cart-add>`
        );
      });

      it('should not render quantity controls', () => {
        expect(element).not.toContainElement('oryx-cart-quantity-input');
      });
    });
  });

  describe('when "outlined" option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-cart-add
          sku="1"
          .options=${{ outlined: true }}
        ></oryx-cart-add>`
      );
    });

    it('should set "outline" attribute to the button', async () => {
      const button = element.renderRoot.querySelector('oryx-button');
      expect(button?.hasAttribute('outline')).toBe(true);
    });
  });

  describe('when the component is rendered', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-cart-add sku="1"></oryx-cart-add>`);
    });

    describe('and the quantity is set to 5', () => {
      beforeEach(() => {
        const quantity = element.shadowRoot?.querySelector(
          'oryx-cart-quantity-input'
        ) as QuantityInputComponent;
        quantity.value = 5;
      });

      describe('and the item is added to cart', () => {
        beforeEach(() => {
          const button = element.shadowRoot?.querySelector('button');
          button?.click();
        });

        it('should call "addEntry" cart service method', () => {
          expect(service.addEntry).toHaveBeenCalledWith({
            sku: '1',
            quantity: 5,
          });
        });

        describe('and when the submit button is available again', () => {
          beforeEach(async () => {
            await wait(800);
          });

          describe('and when the sku has changed', () => {
            beforeEach(async () => {
              element.sku = '2';
              element.requestUpdate();
              await nextFrame();
            });

            it('should reset the quantity', () => {
              const quantity = element.shadowRoot?.querySelector(
                'oryx-cart-quantity-input'
              ) as QuantityInputComponent;
              expect(quantity.value).toBe(1);
            });

            describe('and when the item is added to cart', () => {
              beforeEach(() => {
                const button = element.shadowRoot?.querySelector(
                  'button'
                ) as HTMLButtonElement;
                button.click();
              });

              it('should call "addEntry" cart service method', async () => {
                expect(service.addEntry).toHaveBeenNthCalledWith(2, {
                  sku: '2',
                  quantity: 1,
                });
              });
            });
          });
        });
      });
    });
  });

  describe('when an unexpected error happens while adding to cart', () => {
    class MockCartService {
      getEntries = vi.fn().mockReturnValue(of([]));
      addEntry = vi.fn().mockReturnValue(
        of(null).pipe(
          delay(1),
          map(() => {
            throw new Error();
          })
        )
      );
    }

    beforeEach(async () => {
      destroyInjector();
      createInjector({
        providers: [
          { provide: CartService, useClass: MockCartService },
          {
            provide: ProductService,
            useClass: MockProductService,
          },
        ],
      });

      element = await fixture(html`<oryx-cart-add sku="1"></oryx-cart-add>`);

      const button = element.renderRoot.querySelector('button');
      button?.click();
    });

    it('should start loading', async () => {
      expect(element).toContainElement('oryx-button[loading]');
    });

    it('should continue to unloading afterwards', async () => {
      await nextFrame();
      expect(element).toContainElement('oryx-button:not([loading])');
    });
  });
});
