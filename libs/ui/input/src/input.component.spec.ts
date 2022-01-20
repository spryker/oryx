import { expect, fixture, html } from '@open-wc/testing';
import './index';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let element: InputComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-input');
    expect(el).to.be.instanceof(InputComponent);
  });

  describe('label', () => {
    describe('when a label is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-input label="label content"></oryx-input>`
        );
      });
      it('should render a label element', () => {
        const label = element.shadowRoot?.querySelector('label');
        expect(label?.innerText).to.equal('LABEL CONTENT');
      });
    });

    describe('when a label is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-input></oryx-input>`);
      });
      it('should not render a label element', () => {
        const label = element.shadowRoot?.querySelector('label');
        expect(label).not.to.exist;
      });
    });
  });
});
