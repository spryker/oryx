import { fixture, html } from '@open-wc/testing-helpers';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { InputComponent } from './input.component';
import { inputComponent } from './input.def';

describe('InputComponent', () => {
  let element: InputComponent;

  beforeAll(async () => {
    await useComponent(inputComponent);
  });

  describe('render', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-input label="test">
          <input type="password" aria-label="password" />
        </oryx-input>`
      );
    });

    it('should render a wrapper element', () => {
      expect(element.renderRoot.querySelector('div.control')).not.toBeNull();
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });
  });
});
