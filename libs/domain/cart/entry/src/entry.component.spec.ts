import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ProductService } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { LinkService, PricingService, siteProviders } from '@spryker-oryx/site';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { featureVersion, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { QuantityInputComponent } from '../../quantity-input/src';
import { CartEntryComponent } from './entry.component';
import { cartEntryComponent } from './entry.def';
import { RemoveByQuantity } from './entry.model';

class MockCartService implements Partial<CartService> {
  isBusy = vi.fn().mockReturnValue(of(false));
  isEmpty = vi.fn().mockReturnValue(of(false));
  getCart = vi.fn().mockReturnValue(of());
  getEntries = vi.fn().mockReturnValue(of([]));
  updateEntry = vi.fn().mockReturnValue(of(null));
  deleteEntry = vi.fn().mockReturnValue(of(null));
}

class MockSemanticLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of('/cart'));
}

class mockPricingService {
  format = vi.fn().mockReturnValue(of());
}

describe('CartEntryComponent', () => {
  let element: CartEntryComponent;
  let service: MockCartService;

  const entry = { groupKey: '1', sku: '1', quantity: 1 };

  beforeAll(async () => {
    await useComponent(cartEntryComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        ...siteProviders,
        {
          provide: ProductService,
          useClass: MockProductService,
        },
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: LinkService,
          useClass: MockSemanticLinkService,
        },
        {
          provide: PricingService,
          useClass: mockPricingService,
        },
      ],
    });

    service = testInjector.inject(CartService) as unknown as MockCartService;
  });

  afterEach(() => destroyInjector());

  describe('when cart entries are loaded', () => {
    beforeEach(async () => {
      service.getEntries.mockReturnValue(of([entry]));
    });

    describe('readonly', () => {
      describe('when readonly is false', () => {
        beforeEach(async () => {
          element = await fixture(html` <oryx-cart-entry></oryx-cart-entry>`);
        });

        it('should render quantity input', () => {
          expect(element).toContainElement('oryx-quantity-input');
        });
      });

      describe('when readonly is true', () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-cart-entry
            readonly
          ></oryx-cart-entry>`);
        });

        it('should not render quantity input', () => {
          expect(element).not.toContainElement('oryx-quantity-input');
        });
      });
    });

    describe('available', () => {
      describe('when there is a quantity of 3 available', () => {
        beforeEach(async () => {
          element = await fixture(
            html` <oryx-cart-entry sku="1"></oryx-cart-entry>`
          );
        });

        it('should set the max property of the quantity input to 3', () => {
          const quantityInput = element.shadowRoot?.querySelector(
            'oryx-quantity-input'
          );
          expect((quantityInput as QuantityInputComponent).max).toBe(3);
        });
      });

      describe('when availability is set to isNeverOutOfStock', () => {
        beforeEach(async () => {
          element = await fixture(
            html` <oryx-cart-entry sku="2"></oryx-cart-entry>`
          );
        });

        it('should set the max property to Infinity', () => {
          const quantityInput = element.shadowRoot?.querySelector(
            'oryx-quantity-input'
          );
          expect((quantityInput as QuantityInputComponent).max).toBe(Infinity);
        });
      });

      describe('when available is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html` <oryx-cart-entry sku="4"></oryx-cart-entry>`
          );
        });

        it('should set the max property to Infinity', () => {
          const quantityInput = element.shadowRoot?.querySelector(
            'oryx-quantity-input'
          );
          expect((quantityInput as QuantityInputComponent).max).toBe(Infinity);
        });
      });
    });

    describe('options', () => {
      describe('enableItemImage', () => {
        describe('when enableItemImage is not provided', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry></oryx-cart-entry>`);
          });

          it('should render product-media by default', () => {
            expect(element).toContainElement('oryx-product-media');
          });
        });

        describe('when enableItemImage is false', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              .options=${{ enableItemImage: false }}
            ></oryx-cart-entry>`);
          });
          it('should not render product-media', () => {
            expect(element).not.toContainElement('oryx-product-media');
          });
        });

        describe('when enableItemImage is true', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              .options=${{ enableItemImage: true }}
            ></oryx-cart-entry>`);
          });
          it('should not render product-media', () => {
            expect(element).toContainElement('oryx-product-media');
          });
        });
      });

      describe('enableId', () => {
        describe('when enableItemId is not provided', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              quantity="1"
            ></oryx-cart-entry>`);
          });

          it('should render enableItemId by default', () => {
            expect(element).toContainElement('oryx-product-id');
          });
        });

        describe('when enableId is false', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              quantity="1"
              .options=${{ enableItemId: false }}
            ></oryx-cart-entry>`);
          });
          it('should not render enableItemId', () => {
            expect(element).not.toContainElement('oryx-product-id');
          });
        });

        describe('when enableItemId is true', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              quantity="1"
              .options=${{ enableItemId: true }}
            ></oryx-cart-entry>`);
          });
          it('should render enableItemId', () => {
            expect(element).toContainElement('oryx-product-id');
          });
        });
      });

      describe('enableItemPrice', () => {
        if (featureVersion < '1.2') {
          describe('when enableItemPrice is not provided', () => {
            beforeEach(async () => {
              element = await fixture(html` <oryx-cart-entry
                quantity="1"
              ></oryx-cart-entry>`);
            });

            it('should render enableItemPrice by default', () => {
              expect(element).toContainElement('oryx-product-price');
            });
          });

          describe('when enableItemPrice is false', () => {
            beforeEach(async () => {
              element = await fixture(html` <oryx-cart-entry
                quantity="1"
                .options=${{ enableItemPrice: false }}
              ></oryx-cart-entry>`);
            });
            it('should not render enableItemPrice', () => {
              expect(element).not.toContainElement('oryx-product-price');
            });
          });

          describe('when enableItemPrice is true', () => {
            beforeEach(async () => {
              element = await fixture(html` <oryx-cart-entry
                quantity="1"
                .options=${{ enableItemPrice: true }}
              ></oryx-cart-entry>`);
            });
            it('should render enableItemPrice', () => {
              expect(element).toContainElement('oryx-product-price');
            });
          });
        }

        if (featureVersion >= '1.2') {
          describe('when enableItemPrice is not provided', () => {
            beforeEach(async () => {
              element = await fixture(html` <oryx-cart-entry
                quantity="1"
                unitPrice="100"
                discountedUnitPrice="200"
              ></oryx-cart-entry>`);
            });

            it('should render the original unit price by default', () => {
              expect(element).toContainElement('oryx-site-price.original');
            });

            it('should render the discounted unit price by default', () => {
              expect(element).toContainElement('oryx-site-price.sales');
            });
          });

          describe('when enableItemPrice is false', () => {
            beforeEach(async () => {
              element = await fixture(html` <oryx-cart-entry
                quantity="1"
                unitPrice="100"
                discountedUnitPrice="200"
                .options=${{ enableItemPrice: false }}
              ></oryx-cart-entry>`);
            });

            it('should not render the original unit price by default', () => {
              expect(element).not.toContainElement('oryx-site-price.original');
            });

            it('should not render the discounted unit price by default', () => {
              expect(element).not.toContainElement('oryx-site-price.sales');
            });
          });

          describe('when enableItemPrice is true', () => {
            beforeEach(async () => {
              element = await fixture(html` <oryx-cart-entry
                quantity="1"
                unitPrice="100"
                discountedUnitPrice="200"
                .options=${{ enableItemPrice: true }}
              ></oryx-cart-entry>`);
            });

            it('should render the original unit price by default', () => {
              expect(element).toContainElement('oryx-site-price.original');
            });

            it('should render the discounted unit price by default', () => {
              expect(element).toContainElement('oryx-site-price.sales');
            });
          });
        }
      });

      describe('removeByQuantity', () => {
        const quantityInput = () =>
          element.shadowRoot?.querySelector(
            'oryx-quantity-input'
          ) as QuantityInputComponent;

        describe('when removeByQuantity is Not Allowed', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              quantity="1"
              .options=${{ removeByQuantity: RemoveByQuantity.NotAllowed }}
            ></oryx-cart-entry>`);
          });

          it('should set the min property of the quantity input to 1', () => {
            expect(quantityInput().min).toBe(1);
          });

          it('should not have a decreaseIcon icon', () => {
            expect(quantityInput().decreaseIcon).toBeUndefined();
          });
        });

        describe('when removeByQuantity is ShowBin', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              quantity="1"
              .options=${{ removeByQuantity: RemoveByQuantity.ShowBin }}
            ></oryx-cart-entry>`);
          });

          it('should set the min property of the quantity input to 0', () => {
            expect(quantityInput().min).toBe(0);
          });

          it('should have a decreaseIcon icon (trash)', () => {
            expect(quantityInput().decreaseIcon).toBe(IconTypes.Trash);
          });
        });

        describe('when removeByQuantity is Allowed', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              quantity="1"
              .options=${{ removeByQuantity: RemoveByQuantity.Allowed }}
            ></oryx-cart-entry>`);
          });

          it('should set the min property of the quantity input to 0', () => {
            expect(quantityInput().min).toBe(0);
          });

          it('should not have a decreaseIcon icon', () => {
            expect(quantityInput().decreaseIcon).toBeUndefined();
          });
        });
      });
    });

    describe('and the cart is busy', () => {
      const isBusy$ = new BehaviorSubject(true);
      beforeEach(async () => {
        service.getEntries.mockReturnValue(of([entry]));
        service.isBusy.mockReturnValue(isBusy$);

        element = await fixture(html` <oryx-cart-entry
          key="1"
          .options=${{ removeByQuantity: RemoveByQuantity.ShowBin }}
        ></oryx-cart-entry>`);
      });

      it('should disable the oryx-quantity-input', () => {
        expect(element).toContainElement('oryx-quantity-input[disabled]');
      });

      it('should disable the actions', () => {
        expect(element).toContainElement('.actions oryx-button[disabled]');
      });

      describe('and when the cart is no longer busy', () => {
        beforeEach(() => {
          isBusy$.next(false);
        });

        it('should enable the oryx-quantity-input', () => {
          expect(element).toContainElement(
            'oryx-quantity-input:not([disabled])'
          );
        });

        it('should enable the actions', () => {
          expect(element).toContainElement(
            '.actions oryx-button:not([disabled])'
          );
        });
      });
    });

    if (featureVersion >= '1.2') {
      describe('discounted unit price', () => {
        describe('when the unit price is the same as the discounted unit price', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              quantity="1"
              unitPrice="100"
              discountedUnitPrice="100"
            ></oryx-cart-entry>`);
          });

          it('should not render the original price', () => {
            expect(element).not.toContainElement('oryx-site-price.original');
          });

          it('should render the sales price', () => {
            expect(element).toContainElement('oryx-site-price.sales');
          });
        });
      });

      describe('when the unit price is not the same as the discounted unit price', () => {
        beforeEach(async () => {
          element = await fixture(html` <oryx-cart-entry
            quantity="1"
            unitPrice="100"
            discountedUnitPrice="200"
          ></oryx-cart-entry>`);
        });

        it('should render the original price', () => {
          expect(element).toContainElement('oryx-site-price.original');
        });

        it('should render the sales price', () => {
          expect(element).toContainElement('oryx-site-price.sales');
        });
      });
    }
  });
});
