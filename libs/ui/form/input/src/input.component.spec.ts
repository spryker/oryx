import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import '@spryker-oryx/testing';
import { a11yConfig } from '@spryker-oryx/typescript-utils';
import { inputComponent } from './component';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let element: InputComponent;

  beforeAll(async () => {
    await useComponent(inputComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-input');
    expect(el).toBeInstanceOf(InputComponent);
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
