import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { siteProviders } from '@spryker-oryx/site';
import { html } from 'lit';
import { CartEntryOptionsComponent } from './options.component';
import { cartEntryOptionsComponent } from './options.def';

describe('CartEntryOptionsComponent', () => {
  const callback = vi.fn();
  const showOptions = false;
  let element: CartEntryOptionsComponent;

  const selectedProductOptions = [
    {
      optionGroupName: 'test',
      sku: 'test',
      optionName: 'test',
      price: 1000,
    },
  ];

  beforeAll(async () => {
    await useComponent(cartEntryOptionsComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: siteProviders,
    });
    element = await fixture(html`
      <cart-entry-options
        .options=${{ showOptions, selectedProductOptions }}
        @toggle=${callback}
      ></cart-entry-options>
    `);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should dispatch @toggle event with opposite state in "detail" when click on toggle button', () => {
    element.renderRoot.querySelector('button')?.click();
    expect(callback).toHaveBeenCalledWith(
      new CustomEvent('toggle', { detail: { state: !showOptions } })
    );
  });
});
