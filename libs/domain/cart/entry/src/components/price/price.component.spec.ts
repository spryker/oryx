import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { PricingService } from '@spryker-oryx/site';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartEntryPriceComponent } from './price.component';
import { cartEntryPriceComponent } from './price.def';

class MockPricingService implements Partial<PricingService> {
  format = vi.fn().mockReturnValue(of('10,00'));
}

describe('CartEntryPriceComponent', () => {
  let element: CartEntryPriceComponent;
  const priceTitle = 'Price title';

  beforeAll(async () => {
    await useComponent(cartEntryPriceComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: PricingService,
          useClass: MockPricingService,
        },
      ],
    });

    element = await fixture(html`
      <cart-entry-price .price=${1000}> ${priceTitle} </cart-entry-price>
    `);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render the price', async () => {
    await elementUpdated(element);
    expect(element.renderRoot.textContent).toContain('10,00');
  });

  it('should render the title in default slot', () => {
    expect(element.textContent).toContain(priceTitle);
  });
});
