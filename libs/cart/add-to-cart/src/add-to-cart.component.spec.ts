import { elementUpdated, fixture, nextFrame } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import {
  quantityInputComponent,
  QuantityInputComponent,
} from '@spryker-oryx/cart/quantity-input';
import { useComponent } from '@spryker-oryx/core/utilities';
import {
  createInjector,
  destroyInjector,
  Injector,
} from '@spryker-oryx/injector';
import { ProductService } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { wait } from '@spryker-oryx/typescript-utils';
import { html } from 'lit';
import { delay, map, of } from 'rxjs';
import { AddToCartComponent } from './add-to-cart.component';
import { addToCartComponent } from './add-to-cart.def';

class MockCartService {
  addEntry = vi.fn().mockReturnValue(of(null).pipe(delay(1)));
}

describe('AddToCartComponent', () => {
  let element: AddToCartComponent;
  let service: Partial<MockCartService>;
  let testInjector: Injector;

  const getQuantityInput = (): QuantityInputComponent =>
    element.renderRoot.querySelector(
      'quantity-input'
    ) as QuantityInputComponent;

  const handleQuantity = async (quantity: number): Promise<void> => {
    const input = getQuantityInput();
    input.value = quantity;

    input.requestUpdate();
    await elementUpdated(input);

    input.dispatchEvent(
      new CustomEvent('oryx.quantity', { detail: { quantity } })
    );
  };

  const submit = (): void => {
    const form = element.renderRoot.querySelector('form') as HTMLFormElement;
    form.submit();
  };

  beforeAll(async () => {
    await useComponent([quantityInputComponent, addToCartComponent]);
  });

  beforeEach(() => {
    testInjector = createInjector({
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

  describe('when "disabled" prop is true', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<add-to-cart
          sku="1"
          .options=${{ hideQuantityInput: false, disabled: true }}
        ></add-to-cart>`
      );
    });

    it('should make submit button disabled', () => {
      const button = element.renderRoot.querySelector('button');
      expect(button?.hasAttribute('disabled')).toBe(true);
    });

    it('should make quantity input disabled', () => {
      const input = element.renderRoot.querySelector('quantity-input');
      expect(input?.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('when "hideQuantityInput" prop is true', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<add-to-cart
          sku="1"
          .options=${{ hideQuantityInput: true }}
        ></add-to-cart>`
      );
    });

    describe('and form is submitted', () => {
      beforeEach(() => {
        submit();
      });

      it('should call "addEntry" cart service method', () => {
        expect(service.addEntry).toHaveBeenCalledWith({
          sku: '1',
          quantity: 1,
        });
      });

      it('should set loading state', () => {
        const oryxButton = element.renderRoot.querySelector('oryx-button');
        expect(oryxButton?.hasAttribute('loading')).toBe(true);
      });

      it('should set "success" state for 800ms', async () => {
        const oryxButton = element.renderRoot.querySelector('oryx-button');
        const button = element.renderRoot.querySelector('button');
        await nextFrame();
        expect(oryxButton?.hasAttribute('loading')).toBe(false);
        expect(button?.hasAttribute('inert')).toBe(true);
        await wait(800);
        expect(button?.hasAttribute('inert')).toBe(false);
      });
    });

    it('should not render quantity controls', () => {
      const quantityControls = element.renderRoot.querySelector(
        'quantity-input'
      ) as QuantityInputComponent;

      expect(quantityControls).toBeNull();
    });
  });

  describe('when "hideQuantityInput" prop is false', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<add-to-cart
          sku="1"
          .options=${{ hideQuantityInput: false }}
        ></add-to-cart>`
      );
    });

    describe('and form is submitted', () => {
      beforeEach(() => {
        submit();
      });

      it('should call "addEntry" cart service method', () => {
        expect(service.addEntry).toHaveBeenCalledWith({
          sku: '1',
          quantity: 1,
        });
      });

      it('should set loading state', () => {
        const oryxButton = element.renderRoot.querySelector('oryx-button');
        expect(oryxButton?.hasAttribute('loading')).toBe(true);
      });

      it('should set "success" state for 800ms', async () => {
        const oryxButton = element.renderRoot.querySelector('oryx-button');
        const button = element.renderRoot.querySelector('button');
        await nextFrame();
        expect(oryxButton?.hasAttribute('loading')).toBe(false);
        expect(button?.hasAttribute('inert')).toBe(true);
        await wait(800);
        expect(button?.hasAttribute('inert')).toBe(false);
      });
    });

    describe('and form submitted with incorrect quantity', () => {
      beforeEach(async () => {
        handleQuantity(0.5);

        element.requestUpdate();
        await elementUpdated(element);

        submit();
      });

      it('should not call "addEntry" cart service method', () => {
        expect(service.addEntry).not.toHaveBeenCalled();
      });
    });

    describe('and wrong sku is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<add-to-cart
            sku="test"
            .options=${{ hideQuantityInput: false }}
          ></add-to-cart>`
        );

        submit();
      });

      it('should not call "addEntry" cart service method', () => {
        expect(service.addEntry).not.toHaveBeenCalled();
      });
    });

    it('should render quantity controls', () => {
      expect(element).toContainElement('oryx-button');
    });
  });

  describe('when "outlined" option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<add-to-cart sku="1" .options=${{ outlined: true }}></add-to-cart>`
      );
    });

    it('should set "outline" attribute to the button', async () => {
      const button = element.renderRoot.querySelector('oryx-button');

      expect(button?.hasAttribute('outline')).toBe(true);
    });
  });

  describe('when product changes', () => {
    beforeEach(async () => {
      element = await fixture(html`<add-to-cart sku="1"></add-to-cart>`);
    });

    it('should restore default quantity', async () => {
      handleQuantity(3);

      element.requestUpdate();
      await elementUpdated(element);

      expect(getQuantityInput().value).toBe(3);

      element.sku = '2';

      element.requestUpdate();
      await elementUpdated(element);

      expect(getQuantityInput().value).toBe(1);
    });
  });

  describe('when submit gets error', () => {
    class MockCartService {
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

      element = await fixture(
        html`<add-to-cart
          sku="1"
          .options=${{ hideQuantityInput: true }}
        ></add-to-cart>`
      );
    });

    it('should interrupt loading', async () => {
      const button = element.renderRoot.querySelector('oryx-button');

      submit();

      expect(button?.hasAttribute('loading')).toBe(true);

      await nextFrame();

      expect(button?.hasAttribute('loading')).toBe(false);
    });
  });
});
