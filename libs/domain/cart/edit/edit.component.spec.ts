import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormFieldType, FormRenderer } from '@spryker-oryx/form';
import {
  CurrencyService,
  PriceModeService,
  PriceModes,
  PricingService,
  StoreService,
} from '@spryker-oryx/site';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartEditComponent } from './edit.component';
import { cartEditComponent } from './edit.def';

class MockFormRenderer implements Partial<FormRenderer> {
  buildForm = vi.fn().mockReturnValue(html``);
}

class MockCartService implements Partial<CartService> {
  getCart = vi.fn().mockReturnValue(of());
}

class MockCurrencyService implements Partial<CurrencyService> {
  get = vi.fn().mockReturnValue(of('MOCK'));
  getAll = vi.fn().mockReturnValue(of([{ name: 'Mock', code: 'MOCK' }]));
}

class MockPriceModeService implements Partial<PriceModeService> {
  get = vi.fn().mockReturnValue(of(PriceModes.GrossMode));
}

class MockStoreService implements Partial<StoreService> {
  get = vi.fn().mockReturnValue(of('Mock'));
}

class mockPricingService {
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
  {
    id: 'isDefault',
    type: FormFieldType.Boolean,
    label: i18n('cart.edit.set-default'),
    width: 100,
  },
];

const expectedValues = {
  isDefault: true,
  priceMode: PriceModes.GrossMode,
  currency: 'MOCK',
};

describe('CartEditComponent', () => {
  let renderer: MockFormRenderer;
  let element: CartEditComponent;

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
          provide: StoreService,
          useClass: MockStoreService,
        },
        {
          provide: PriceModeService,
          useClass: MockPriceModeService,
        },
        {
          provide: PricingService,
          useClass: mockPricingService,
        },
      ],
    });
    renderer = testInjector.inject<MockFormRenderer>(FormRenderer);
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
});
