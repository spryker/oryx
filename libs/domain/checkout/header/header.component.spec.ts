import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { CheckoutHeaderComponent } from './header.component';
import { checkoutHeaderComponent } from './header.def';

describe('CheckoutHeaderComponent', () => {
  let element: CheckoutHeaderComponent;

  beforeAll(async () => {
    await useComponent(checkoutHeaderComponent);
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-checkout-header></oryx-checkout-header>`
      );
    });

    it('should be an instance of ', () => {
      expect(element).toBeInstanceOf(CheckoutHeaderComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });
});
