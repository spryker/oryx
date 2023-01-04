import { fixture } from '@open-wc/testing-helpers';
import { CartService } from '@spryker-oryx/cart';
import { CartEntryComponent } from '@spryker-oryx/cart/entry';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ProductService } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { html } from 'lit';
import { of } from 'rxjs';
import { CartEntriesComponent } from './entries.component';
import { cartEntriesComponent } from './entries.def';

class MockCartService {
  getLoadingState = vi.fn().mockReturnValue(of(false));
  getEntries = vi.fn().mockReturnValue(of([]));
  updateEntry = vi.fn().mockReturnValue(of(null));
  deleteEntry = vi.fn().mockReturnValue(of(null));
}

describe('CartEntriesComponent', () => {
  let element: CartEntriesComponent;
  let service: MockCartService;

  const entry = { groupKey: '1', sku: '1', quantity: 1 };

  beforeAll(async () => {
    await useComponent(cartEntriesComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
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
    element = await fixture(html`<cart-entries></cart-entries>`);

    service = testInjector.inject(CartService) as unknown as MockCartService;
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when cart is empty', () => {
    beforeEach(async () => {
      service.getEntries = vi.fn().mockReturnValue(of([]));
      element = await fixture(html`<cart-entries></cart-entries>`);
    });

    it('should render the section', () => {
      expect(element).toContainElement('section');
    });
  });

  describe('when cart contains entries', () => {
    let entryElement: CartEntryComponent | null;

    beforeEach(async () => {
      service.getEntries = vi.fn().mockReturnValue(of([entry]));
      element = await fixture(html`<cart-entries></cart-entries>`);
      entryElement = element.renderRoot.querySelector('cart-entry');
    });

    it('should render the entry', () => {
      expect(element).toContainElement('cart-entry');
    });

    it('should emit update when quantity is submitted', () => {
      const quantity = 2;
      entryElement?.dispatchEvent(
        new CustomEvent('submit', { detail: { quantity } })
      );

      expect(service.updateEntry).toHaveBeenCalledWith({ ...entry, quantity });
    });

    it('should emit remove when remove event is dispatched', () => {
      entryElement?.dispatchEvent(new CustomEvent('oryx.remove'));

      expect(service.deleteEntry).toHaveBeenCalledWith({
        groupKey: entry.groupKey,
      });
    });

    describe('and cart is loading', () => {
      beforeEach(async () => {
        service.getLoadingState.mockReturnValue(of(true));
        element = await fixture(html`<cart-entries></cart-entries>`);
        entryElement = element.renderRoot.querySelector('cart-entry');
      });

      it('should set inert attribute on entry', () => {
        expect(entryElement?.hasAttribute('inert')).toBe(true);
      });

      it('should pass disabled option', () => {
        expect(entryElement?.options?.disabled).toBe(true);
      });
    });
  });

  describe('when entries is collapsible', () => {
    beforeEach(async () => {
      service.getEntries = vi.fn().mockReturnValue(of([entry]));
      element = await fixture(html`
        <cart-entries .options=${{ collapsible: true }}></cart-entries>
      `);
    });

    it('should render collapsible component', () => {
      expect(element).toContainElement('oryx-collapsible');
    });

    it('should render the chip with correct label', () => {
      const chip = element.renderRoot.querySelector('oryx-chip');
      expect(chip).not.toBe(null);
      expect(chip?.textContent).toContain('1 item');
    });

    describe('and expanded by default', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <cart-entries
            .options=${{ collapsible: true, expanded: true }}
          ></cart-entries>
        `);
      });

      it('should render collapsible component expanded', () => {
        expect(element).toContainElement('oryx-collapsible[open]');
      });
    });

    describe('and items count is hidden', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <cart-entries
            .options=${{ collapsible: true, hideItemsCount: true }}
          ></cart-entries>
        `);
      });

      it('should not render the chip', () => {
        expect(element).not.toContainElement('oryx-chip');
      });
    });

    describe('and multiple entries are in the cart', () => {
      beforeEach(async () => {
        service.getEntries = vi.fn().mockReturnValue(of([entry, entry, entry]));
        element = await fixture(html`
          <cart-entries .options=${{ collapsible: true }}></cart-entries>
        `);
      });

      it('should render the chip with correct label', () => {
        const chip = element.renderRoot.querySelector('oryx-chip');
        expect(chip?.textContent).toContain('3 items');
      });
    });
  });
});
