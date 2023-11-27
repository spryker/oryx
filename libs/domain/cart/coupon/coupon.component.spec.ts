import { fixture, html } from '@open-wc/testing-helpers';
import { CartService, Coupon } from '@spryker-oryx/cart';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { NotificationService, PricingService } from '@spryker-oryx/site';
import { useComponent } from '@spryker-oryx/utilities';
import { of, throwError } from 'rxjs';
import { CouponComponent } from './coupon.component';
import { couponComponent } from './coupon.def';

class MockCartService implements Partial<CartService> {
  isEmpty = vi.fn().mockReturnValue(of(false));
  addCoupon = vi.fn().mockReturnValue(of());
  getCoupons = vi.fn().mockReturnValue(of([]));
}

class MockNotificationService implements Partial<NotificationService> {
  push = vi.fn();
}

class mockPricingService {
  format = vi.fn().mockReturnValue(of('price'));
}

describe('CouponComponent', () => {
  let element: CouponComponent;
  let service: MockCartService;

  const coupons: Coupon[] = [
    {
      id: '1',
      amount: 10,
      code: 'COUPON1',
      discountType: 'percentage',
      displayName: 'Coupon 1',
      expirationDateTime: '2022-12-31',
    },
    {
      id: '2',
      amount: 20,
      code: 'COUPON2',
      discountType: 'percentage',
      displayName: 'Coupon 2',
      expirationDateTime: '2023-06-30',
    },
  ];

  beforeAll(async () => {
    await useComponent(couponComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: PricingService,
          useClass: mockPricingService,
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
      ],
    });
    element = await fixture(html`<oryx-cart-coupon></oryx-cart-coupon>`);

    service = testInjector.inject(CartService) as unknown as MockCartService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when cart contains coupons', () => {
    beforeEach(async () => {
      service.getCoupons = vi.fn().mockReturnValue(of(coupons));
      element = await fixture(html`<oryx-cart-coupon></oryx-cart-coupon>`);
    });

    it('should render the coupon list', async () => {
      const couponElements = element.shadowRoot?.querySelectorAll('li');
      expect(couponElements?.length).toBe(coupons.length);

      couponElements?.forEach((couponElement, index) => {
        const coupon = coupons[index];

        expect(couponElement.textContent).to.contain(coupon.code);
        expect(couponElement.textContent).to.contain(coupon.displayName);
      });
    });
  });

  describe('when cart does not contain coupons', () => {
    beforeEach(async () => {
      service.getCoupons = vi.fn().mockReturnValue(of([]));
      element = await fixture(html`<oryx-cart-coupon></oryx-cart-coupon>`);
    });

    it('should not render the coupon list', async () => {
      const couponElements = element.shadowRoot?.querySelectorAll('li');
      expect(couponElements?.length).toBe(0);
    });
  });

  describe('when applying coupon successfully', () => {
    beforeEach(async () => {
      service.addCoupon = vi.fn().mockReturnValue(of());
      element = await fixture(html`<oryx-cart-coupon></oryx-cart-coupon>`);
    });

    it('should call addCoupon', async () => {
      const couponCode = '12grVfg';
      element.coupon!.value = couponCode;

      const button =
        element.shadowRoot?.querySelector<HTMLElement>('oryx-button');
      button?.click();

      expect(service.addCoupon).toHaveBeenCalledWith({ code: couponCode });
    });
  });

  describe('when applying coupon with error', () => {
    beforeEach(async () => {
      service.addCoupon = vi
        .fn()
        .mockReturnValue(throwError(() => 'Invalid coupon'));
      element = await fixture(html`<oryx-cart-coupon></oryx-cart-coupon>`);
    });

    it('should show error message in input', async () => {
      const couponCode = '12grVfg';
      element.coupon!.value = couponCode;

      const button =
        element.shadowRoot?.querySelector<HTMLElement>('oryx-button');
      button?.click();

      expect(element.hasError).toBe(true);
    });

    it('should not call addCoupon', async () => {
      element.coupon!.value = '';

      const button =
        element.shadowRoot?.querySelector<HTMLElement>('oryx-button');
      button?.click();

      expect(service.addCoupon).not.toHaveBeenCalled();
      expect(element.hasError).toBe(true);
    });
  });
});
