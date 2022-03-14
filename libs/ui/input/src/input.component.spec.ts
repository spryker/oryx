import { expect, fixture, html } from '@open-wc/testing';
import { a11yConfig } from '../../a11y';
import './index';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let element: InputComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-input');
    expect(el).to.be.instanceof(InputComponent);
  });

  describe('render', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-input .options=${{ label: 'test' }}>
          <input type="password" aria-label="password" placeholder="Password" />
        </oryx-input>`
      );
    });

    it('should render a wrapper element', () => {
      expect(element.renderRoot.querySelector('div.control')).to.exist;
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });
  });
});
