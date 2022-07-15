import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { of } from 'rxjs';
import '../index';
import { MiniCartComponent } from './mini-cart.component';

class MockCartService {
  getCart = vi.fn();
}

describe('Mini Card', () => {
  let element: MiniCartComponent;
  let service: MockCartService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
      ],
    });

    service = testInjector.inject(CartService) as unknown as MockCartService;
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when quantity property is less then 100', () => {
    const quantity = 5;

    beforeEach(async () => {
      service.getCart.mockReturnValue(of({ products: [{ quantity }] }));
      element = await fixture(html`<mini-cart uid="1"></mini-cart>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it(`should render ${quantity} as quantity`, () => {
      const quantityBadge = element.renderRoot.querySelector(
        '.badge'
      ) as HTMLDivElement;

      expect(quantityBadge.textContent).toContain(quantity.toString());
    });
  });

  describe('when quantity property is greater then 100', () => {
    const quantity = 155;

    beforeEach(async () => {
      service.getCart.mockReturnValue(of({ products: [{ quantity }] }));
      element = await fixture(html`<mini-cart uid="1"></mini-cart>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it(`should render ${quantity} as quantity`, () => {
      const quantityBadge = element.renderRoot.querySelector(
        '.badge'
      ) as HTMLDivElement;

      expect(quantityBadge.textContent).toContain('99+');
    });
  });

  describe('when quantity is provided through the prop', () => {
    const quantity = 5;

    beforeEach(async () => {
      service.getCart.mockReturnValue(of(null));
      element = await fixture(
        html`<mini-cart uid="1" .options=${{ quantity }}></mini-cart>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it(`should render ${quantity} as quantity`, () => {
      const quantityBadge = element.renderRoot.querySelector(
        '.badge'
      ) as HTMLDivElement;

      expect(quantityBadge.textContent).toContain(quantity);
    });
  });

  describe('when quantity is provided through prop and service', () => {
    const serviceQuantity = 3;
    const propQuantity = 5;

    beforeEach(async () => {
      service.getCart.mockReturnValue(
        of({ products: [{ quantity: serviceQuantity }] })
      );
      element = await fixture(
        html`<mini-cart
          uid="1"
          .options=${{ quantity: propQuantity }}
        ></mini-cart>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it(`should render quantity provided through the prop`, () => {
      const quantityBadge = element.renderRoot.querySelector(
        '.badge'
      ) as HTMLDivElement;

      expect(quantityBadge.textContent).toContain(propQuantity);
    });
  });

  describe('when quantity is not provided through service and prop', () => {
    beforeEach(async () => {
      service.getCart.mockReturnValue(of(null));
      element = await fixture(html`<mini-cart uid="1"></mini-cart>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it(`should render 0 as quantity`, () => {
      const quantityBadge = element.renderRoot.querySelector(
        '.badge'
      ) as HTMLDivElement;

      expect(quantityBadge.textContent).toContain('0');
    });
  });
});
