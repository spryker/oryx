import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { ButtonComponent } from './button.component';
import { buttonComponent } from './button.def';

describe('ButtonComponent', () => {
  let element: ButtonComponent;

  beforeAll(async () => {
    await useComponent(buttonComponent);
  });

  describe('when the element is created', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-button>text</oryx-button>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });
});
