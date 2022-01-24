import { expect, fixture, html } from '@open-wc/testing';
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
        html`<oryx-input><input type="password" /></oryx-input>`
      );
    });

    it('should render a wrapper element', () => {
      expect(element.renderRoot.querySelector('div.control')).to.exist;
    });
  });
});
