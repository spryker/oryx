import { fixture, html, nextFrame } from '@open-wc/testing-helpers';
import { CartService, quantityInputComponent } from '@spryker-oryx/cart';
import {
  QuantityEventDetail,
  QuantityInputComponent,
} from '@spryker-oryx/cart/quantity-input';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Product, ProductService } from '@spryker-oryx/product';
import { PricingService } from '@spryker-oryx/site';
import { buttonComponent } from '@spryker-oryx/ui';
import { ButtonComponent, ButtonType } from '@spryker-oryx/ui/button';
import { useComponent, wait } from '@spryker-oryx/utilities';
import { BehaviorSubject, delay, of } from 'rxjs';
import { CartAddComponent } from './add.component';
import { addToCartComponent } from './add.def';

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of());
  isBusy = vi.fn().mockReturnValue(of(false));
  isEmpty = vi.fn().mockReturnValue(of(false));
  addEntry = vi.fn().mockReturnValue(of(null).pipe(delay(1)));
  getEntries = vi.fn().mockReturnValue(of([]));
}

class MockPricingService implements Partial<PricingService> {
  format = vi.fn().mockReturnValue(of('price'));
}

class MockProductService implements Partial<ProductService> {
  get = vi.fn();
}

describe('CartAddComponent', () => {
  let element: CartAddComponent;
  let service: Partial<MockCartService>;
  let productService: MockProductService;

  beforeAll(async () => {
    await useComponent([
      quantityInputComponent,
      buttonComponent,
      addToCartComponent,
    ]);
  });

  beforeEach(() => {
    const injector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: PricingService,
          useClass: MockPricingService,
        },
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
      ],
    });

    service = injector.inject<MockCartService>(CartService);
    productService = injector.inject<MockProductService>(ProductService);

    // productService.get.mockReturnValue(mockProduct$);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when a correct sku is provided', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(of({ sku: '1' }));
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

  describe('when no product is provided', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(of(null));
      element = await fixture(html`<oryx-cart-add id="1"></oryx-cart-add>`);
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

  describe('when there is quantity available', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ sku: '1', availability: { quantity: 10 } })
      );
      element = await fixture(html`<oryx-cart-add sku="1"></oryx-cart-add>`);
    });

    it('should enable the button', () => {
      const button = element.renderRoot.querySelector(
        'oryx-button'
      ) as ButtonComponent;
      expect(button.disabled).toBeUndefined();
    });

    it('should have a max quantity of 10', () => {
      const quantityInput = element.renderRoot.querySelector(
        'oryx-cart-quantity-input'
      ) as QuantityInputComponent;
      expect(quantityInput.max).toBe(10);
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
        expect(element).toContainElement('oryx-button[disabled]');
      });
    });
  });

  describe('when there is 0 quantity available', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ sku: '1', availability: { quantity: 0 } })
      );
      element = await fixture(html`<oryx-cart-add sku="1"></oryx-cart-add>`);
    });

    it('should disable the button', () => {
      const button = element.renderRoot.querySelector(
        'oryx-button'
      ) as ButtonComponent;
      expect(button).toHaveProperty('disabled');
    });

    it('should have max quantity of 0', () => {
      const quantityInput = element.renderRoot.querySelector(
        'oryx-cart-quantity-input'
      ) as QuantityInputComponent;
      expect(quantityInput.max).toBe(0);
    });
  });

  describe('when isNeverOutOfStock = true', () => {
    describe('and the product is discontinued', () => {
      describe('and the quantity is 0', () => {
        beforeEach(async () => {
          productService.get.mockReturnValue(
            of({
              sku: '1',
              discontinued: true,
              availability: { quantity: 0, isNeverOutOfStock: true },
            } as Product)
          );
          element = await fixture(
            html`<oryx-cart-add sku="1"></oryx-cart-add>`
          );
        });

        it('should disable the button', () => {
          const button =
            element.renderRoot.querySelector<ButtonComponent>('oryx-button');
          expect(button?.disabled).toEqual(true);
        });
      });

      describe('and the quantity > 0', () => {
        beforeEach(async () => {
          productService.get.mockReturnValue(
            of({
              sku: '1',
              discontinued: true,
              availability: { quantity: 5, isNeverOutOfStock: true },
            } as Product)
          );
          element = await fixture(
            html`<oryx-cart-add sku="1"></oryx-cart-add>`
          );
        });

        it('should enable the button', () => {
          const button =
            element.renderRoot.querySelector<ButtonComponent>('oryx-button');
          expect(button?.disabled).toBeUndefined();
        });
      });
    });

    describe('and the product is not discontinued', () => {
      beforeEach(async () => {
        productService.get.mockReturnValue(
          of({
            sku: '1',
            availability: { quantity: 0, isNeverOutOfStock: true },
          } as Product)
        );
        element = await fixture(html`<oryx-cart-add sku="1"></oryx-cart-add>`);
      });

      it('should enable the button', () => {
        const button =
          element.renderRoot.querySelector<ButtonComponent>('oryx-button');
        expect(button?.disabled).toBeUndefined();
      });

      it('should have an infinite max quantity', () => {
        const quantityInput = element.renderRoot.querySelector(
          'oryx-cart-quantity-input'
        ) as QuantityInputComponent;
        expect(quantityInput.max).toBe(Infinity);
      });
    });
  });

  describe('submit', () => {
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ sku: '1', availability: { quantity: 10 } } as Product)
      );
    });

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

      describe('when the item is added successfully to cart', () => {
        beforeEach(() => {
          element.shadowRoot
            ?.querySelector<HTMLElement>('oryx-button')
            ?.click();
        });

        it('should call "addEntry" cart service method', () => {
          expect(service.addEntry).toHaveBeenCalledWith({
            sku: '1',
            quantity: 1,
          });
        });

        describe('and when the item is successfully added', () => {
          beforeEach(async () => {
            await nextFrame();
          });

          it('should have the oryx-button in confirmed state', () => {
            const button = element.renderRoot.querySelector('oryx-button');
            expect(button).toHaveProperty('confirmed');
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

      describe('when adding an item to cart throws an error', () => {
        let errorCallback: any;
        beforeEach(async () => {
          service.addEntry?.mockImplementation(() => {
            return {
              subscribe: vi.fn().mockImplementation(({ error }) => {
                //simulate error handling in subscribe
                //try - catch are required not to pollute test env
                //by unhandled errors
                try {
                  const e = new Error('error');
                  errorCallback = error.bind(null, e);
                  error(e);
                } catch {
                  //
                }
              }),
            };
          });

          element = await fixture(
            html` <oryx-cart-add sku="1"></oryx-cart-add>`
          );
          const button = element.shadowRoot?.querySelector('button');

          button?.click();
          await nextFrame();
        });

        it('should throw the handled error', () => {
          expect(() => errorCallback()).toThrowError('error');
        });

        it('should drop the states from confirmation button', () => {
          expect(element).toContainElement(
            'oryx-button:not([confirmed][loading])'
          );
        });
      });
    });

    describe('when the cart is loaded', () => {
      const busy$ = new BehaviorSubject(false);

      beforeEach(async () => {
        service.isBusy?.mockReturnValue(busy$);
        element = await fixture(html`<oryx-cart-add sku="1"></oryx-cart-add>`);
      });

      it('should not have the oryx-button in loading state', () => {
        expect(element).toContainElement('oryx-button:not([loading])');
      });

      describe('and when the cart becomes busy', () => {
        beforeEach(() => {
          element.renderRoot.querySelector<HTMLElement>('oryx-button')?.click();
        });

        it('should change the oryx-button in loading state', () => {
          expect(element).toContainElement('oryx-button[loading]');
        });

        describe('and when the cart is no longer busy', () => {
          beforeEach(async () => {
            await wait(800);
          });

          it('should no longer have the oryx-button in loading state', () => {
            expect(element).toContainElement('oryx-button:not([loading])');
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
          element.shadowRoot
            ?.querySelector<HTMLElement>('oryx-button')
            ?.click();
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
    beforeEach(async () => {
      productService.get.mockReturnValue(
        of({ sku: '1', availability: { quantity: 10 } } as Product)
      );
    });

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
      productService.get.mockReturnValue(
        of({ sku: '1', availability: { quantity: 10 } } as Product)
      );
      element = await fixture(
        html`<oryx-cart-add
          sku="1"
          .options=${{ outlined: true }}
        ></oryx-cart-add>`
      );
    });

    it('should set "outline" attribute to the button', async () => {
      const button = element.renderRoot.querySelector('oryx-button');
      expect(button).toHaveProperty('type', ButtonType.Outline);
    });
  });

  describe('when the component is rendered', () => {
    const product$ = new BehaviorSubject<Product | null>({
      sku: '1',
      availability: { quantity: 10 },
    } as Product);
    beforeEach(async () => {
      productService.get.mockReturnValue(product$);
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
          element.shadowRoot
            ?.querySelector<HTMLElement>('oryx-button')
            ?.click();
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

          describe('and when the product has changed', () => {
            const quantity = () =>
              element.shadowRoot?.querySelector(
                'oryx-cart-quantity-input'
              ) as QuantityInputComponent;

            beforeEach(async () => {
              vi.spyOn(quantity(), 'reset');
              product$.next({ sku: '2' });
            });

            it('should reset the quantity', () => {
              expect(quantity()?.reset).toHaveBeenCalled();
            });
          });
        });
      });
    });
  });
});
