import { fixture } from '@open-wc/testing-helpers';
import { CARTS, CartService } from '@spryker-oryx/cart';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormFieldType, FormRenderer, SUBMIT_EVENT } from '@spryker-oryx/form';
import { LinkService, RouterService } from '@spryker-oryx/router';
import {
  CurrencyService,
  NotificationService,
  PriceModeService,
  PriceModes,
  PricingService,
} from '@spryker-oryx/site';
import { AlertType } from '@spryker-oryx/ui';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { mockDefaultCart } from '../src/mocks/src';
import { CartEditComponent } from './edit.component';
import { cartEditComponent } from './edit.def';

class MockFormRenderer implements Partial<FormRenderer> {
  buildForm = vi.fn().mockReturnValue(html``);
}

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of());
  createCart = vi.fn().mockReturnValue(of(mockDefaultCart));
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

class MockLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of('/mock'));
}

class MockCurrencyService implements Partial<CurrencyService> {
  get = vi.fn().mockReturnValue(of('MOCK'));
  getAll = vi.fn().mockReturnValue(of([{ name: 'Mock', code: 'MOCK' }]));
}

class MockPriceModeService implements Partial<PriceModeService> {
  get = vi.fn().mockReturnValue(of(PriceModes.GrossMode));
}

class MockNotificationService implements Partial<NotificationService> {
  push = vi.fn();
}

class MockPricingService {
  format = vi.fn().mockReturnValue(of('price'));
}

const expectedFields = [
  {
    id: 'name',
    type: FormFieldType.Text,
    label: i18n('cart.edit.name'),
    placeholder: i18n('cart.edit.name.placeholder'),
    required: true,
    width: 100,
  },
  {
    id: 'currency',
    type: FormFieldType.Select,
    label: i18n('currency'),
    required: true,
    options: [{ value: 'MOCK', text: 'Mock' }],
  },
  {
    id: 'priceMode',
    type: FormFieldType.Select,
    label: i18n('cart.edit.price-mode'),
    required: true,
    options: [
      { value: PriceModes.GrossMode, text: 'gross' },
      { value: PriceModes.NetMode, text: 'net' },
    ],
  },
];

const expectedValues = {
  priceMode: PriceModes.GrossMode,
  currency: 'MOCK',
};

describe('CartEditComponent', () => {
  let renderer: MockFormRenderer;
  let element: CartEditComponent;
  let routerService: MockRouterService;
  let linkService: MockLinkService;
  let cartService: MockCartService;
  let notificationService: MockNotificationService;

  beforeAll(async () => {
    await useComponent(cartEditComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: FormRenderer,
          useClass: MockFormRenderer,
        },
        {
          provide: CurrencyService,
          useClass: MockCurrencyService,
        },
        {
          provide: CartService,
          useClass: MockCartService,
        },
        {
          provide: PriceModeService,
          useClass: MockPriceModeService,
        },
        {
          provide: PricingService,
          useClass: MockPricingService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: LinkService,
          useClass: MockLinkService,
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
      ],
    });
    renderer = testInjector.inject<MockFormRenderer>(FormRenderer);
    routerService = testInjector.inject<MockRouterService>(RouterService);
    linkService = testInjector.inject<MockLinkService>(LinkService);
    cartService = testInjector.inject<MockCartService>(CartService);
    notificationService =
      testInjector.inject<MockNotificationService>(NotificationService);
    element = await fixture(html`<oryx-cart-edit></oryx-cart-edit>`);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should render elements', () => {
    expect(element).toContainElement('form');
    expect(element).toContainElement('oryx-layout');

    const button = element.renderRoot.querySelector('oryx-button');
    expect(button?.textContent).toContain(i18n('create'));
  });

  it('should build a form', () => {
    expect(renderer.buildForm).toHaveBeenCalledWith(
      expectedFields,
      expectedValues
    );
  });

  it('should build redirect url to the carts page', () => {
    expect(linkService.get).toHaveBeenCalledWith({ type: CARTS });
  });

  describe('when form is submitted', () => {
    beforeEach(() => {
      element.renderRoot
        .querySelector('form')
        ?.dispatchEvent(
          new CustomEvent(SUBMIT_EVENT, { detail: { values: mockDefaultCart } })
        );
    });

    it('should create the cart with form values', () => {
      expect(cartService.createCart).toHaveBeenCalledWith(mockDefaultCart);
    });

    it('should push a notification with created cart name', () => {
      expect(notificationService.push).toHaveBeenCalledWith({
        type: AlertType.Success,
        content: {
          token: 'carts.create.cart-<name>-created',
          values: { name: mockDefaultCart.name },
        },
      });
    });

    it('should redirect', () => {
      expect(routerService.navigate).toHaveBeenCalledWith('/mock');
    });
  });
});
