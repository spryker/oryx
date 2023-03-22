import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ProductService } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import {
  PricingService,
  SemanticLinkService,
  siteProviders,
} from '@spryker-oryx/site';
import { html } from 'lit';
import { BehaviorSubject, of } from 'rxjs';
import { QuantityInputComponent } from '../../quantity-input/src';
import { CartService } from '../../src/services';
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

class MockSemanticLinkService implements Partial<SemanticLinkService> {
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
          provide: SemanticLinkService,
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
          element = await fixture(
            html` <oryx-cart-entry key="1"></oryx-cart-entry>`
          );
        });

        it('should render quantity input', () => {
          expect(element).toContainElement('oryx-cart-quantity-input');
        });
      });

      describe('when readonly is true', () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-cart-entry
            readonly
          ></oryx-cart-entry>`);
        });

        it('should not render quantity input', () => {
          expect(element).not.toContainElement('oryx-cart-quantity-input');
        });
      });
    });

    describe('available', () => {
      describe('when there is a quantity of 3 available', () => {
        beforeEach(async () => {
          element = await fixture(
            html` <oryx-cart-entry key="1" available="3"></oryx-cart-entry>`
          );
        });

        it('should set the max property of the quantity input to 3', () => {
          const quantityInput = element.shadowRoot?.querySelector(
            'oryx-cart-quantity-input'
          );
          expect((quantityInput as QuantityInputComponent).max).toBe(3);
        });
      });

      describe('when available is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html` <oryx-cart-entry key="1"></oryx-cart-entry>`
          );
        });

        it('should set the max property to Infinity', () => {
          const quantityInput = element.shadowRoot?.querySelector(
            'oryx-cart-quantity-input'
          );
          expect((quantityInput as QuantityInputComponent).max).toBe(Infinity);
        });
      });
    });

    describe('options', () => {
      describe('enablePreview', () => {
        describe('when enablePreview is not provided', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
            ></oryx-cart-entry>`);
          });

          it('should render product-media by default', () => {
            expect(element).toContainElement('oryx-product-media');
          });
        });

        describe('when enablePreview is false', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              .options=${{ enablePreview: false }}
            ></oryx-cart-entry>`);
          });
          it('should not render product-media', () => {
            expect(element).not.toContainElement('oryx-product-media');
          });
        });

        describe('when enablePreview is true', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              .options=${{ enablePreview: true }}
            ></oryx-cart-entry>`);
          });
          it('should not render product-media', () => {
            expect(element).toContainElement('oryx-product-media');
          });
        });
      });

      describe('enableId', () => {
        describe('when enableId is not provided', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
            ></oryx-cart-entry>`);
          });

          it('should render product-media by default', () => {
            expect(element).toContainElement('oryx-product-id');
          });
        });

        describe('when enableId is false', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              .options=${{ enableId: false }}
            ></oryx-cart-entry>`);
          });
          it('should not render product-media', () => {
            expect(element).not.toContainElement('oryx-product-id');
          });
        });

        describe('when enableId is true', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              .options=${{ enableId: true }}
            ></oryx-cart-entry>`);
          });
          it('should not render product-media', () => {
            expect(element).toContainElement('oryx-product-id');
          });
        });
      });

      describe('removeByQuantity', () => {
        const quantityInput = () =>
          element.shadowRoot?.querySelector(
            'oryx-cart-quantity-input'
          ) as QuantityInputComponent;

        describe('when removeByQuantity is ShowBin', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              .options=${{ removeByQuantity: RemoveByQuantity.ShowBin }}
            ></oryx-cart-entry>`);
          });

          it('should set the min property of the quantity input to 0', () => {
            expect(quantityInput().min).toBe(0);
          });

          it('should have a decreaseIcon icon (trash)', () => {
            expect(quantityInput().decreaseIcon).toBe('trash');
          });
        });

        describe('when removeByQuantity is AllowZero', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              .options=${{ removeByQuantity: RemoveByQuantity.AllowZero }}
            ></oryx-cart-entry>`);
          });

          it('should set the min property of the quantity input to 0', () => {
            expect(quantityInput().min).toBe(0);
          });

          it('should not have a decreaseIcon icon', () => {
            expect(quantityInput().decreaseIcon).toBeUndefined();
          });
        });

        describe('when removeByQuantity is undefined', () => {
          beforeEach(async () => {
            element = await fixture(html` <oryx-cart-entry
              key="1"
              .options=${{ removeByQuantity: undefined }}
            ></oryx-cart-entry>`);
          });

          it('should set the min property of the quantity input to 1', () => {
            expect(quantityInput().min).toBe(1);
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

      it('should disable the oryx-cart-quantity-input', () => {
        expect(element).toContainElement('oryx-cart-quantity-input[disabled]');
      });

      it('should disable the actions', () => {
        expect(element).toContainElement('oryx-icon-button[disabled]');
      });

      describe('and when the cart is no longer busy', () => {
        beforeEach(() => {
          isBusy$.next(false);
        });
        it('should enable the oryx-cart-quantity-input', () => {
          expect(element).toContainElement(
            'oryx-cart-quantity-input:not([disabled])'
          );
        });

        it('should enable the actions', () => {
          expect(element).toContainElement('oryx-icon-button:not([disabled])');
        });
      });
    });
  });
});
