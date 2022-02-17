import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { OryxElement } from '../../../utilities';
import { getControl } from '../util';
import { FormControlController } from './form-control.controller';
import { FormControlOptions } from './form-control.model';

export class InputComponent
  extends LitElement
  implements OryxElement<FormControlOptions>
{
  @property({ type: Object }) options: FormControlOptions = {};
  protected formControlController = new FormControlController(this);
  protected override render(): TemplateResult {
    return html`${this.formControlController.render()}`;
  }
}
customElements.define('fake-input', InputComponent);

export class NoSlotComponent extends InputComponent {
  protected override render(): TemplateResult {
    return html``;
  }
}
customElements.define('fake-without-slot', NoSlotComponent);

describe('FormControlController', () => {
  let element: InputComponent;
  describe('when no slot is available', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-without-slot></fake-without-slot>`);
    });
    it('should not render a control', () => {
      expect(getControl(element)).to.be.undefined;
    });
  });

  describe('control', () => {
    describe('when no light dom is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-input />`);
      });

      it('should render shadow dom', () => {
        expect(getControl(element)).to.eq(
          element.renderRoot.querySelector('input')
        );
      });
    });

    describe('when a text node is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-input> </fake-input>`);
      });
      it('should not render shadow dom', () => {
        expect(getControl(element)).to.be.undefined;
      });
    });

    describe('when light dom is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-input>
          <input id="light" />
        </fake-input>`);
      });
      it('is should render light dom', () => {
        expect(getControl(element)).to.eq(element.querySelector('input#light'));
      });
    });

    describe('when invalid control is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-input>
          <span slot="control">this won't work</span>
        </fake-input>`);
      });
      it('should not have a control', () => {
        expect(getControl(element)).to.be.undefined;
      });
    });

    describe('when slot content is changed', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-input><input /></fake-input>`);
        (
          element.renderRoot.querySelector(
            'slot:not([name])'
          ) as HTMLSlotElement
        ).dispatchEvent(new Event('slotchange'));
      });
      it('should not set the disabled property', () => {
        expect(element?.hasAttribute('disabled')).to.be.false;
      });
    });
  });

  describe('mousedown', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-input>
        <input id="light" />
        <button id="focusable">focusable</button>
        <span id="notFocusable">not focusable</span>
      </fake-input>`);
    });

    describe('when a non-focusable element is clicked', () => {
      beforeEach(async () => {
        element
          .querySelector('#notFocusable')
          ?.dispatchEvent(new Event('mousedown', { bubbles: true }));
      });
      it('should focus the control', () => {
        expect(document.activeElement).to.eq(getControl(element));
      });
    });

    describe('when a focusable element is clicked', () => {
      beforeEach(async () => {
        element
          .querySelector('#focusable')
          ?.dispatchEvent(new Event('mousedown', { bubbles: true }));
      });
      it('should not focus the control', () => {
        expect(document.activeElement).to.not.eq(getControl(element));
      });
    });
  });

  describe('disabled', () => {
    describe('when an input is not disabled', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-input><input /></fake-input>`);
      });
      it('should not set the disabled property', () => {
        expect(element.hasAttribute('disabled')).to.be.false;
      });

      describe('but when it is disabled afterwards', () => {
        beforeEach(async () => {
          element.querySelector('input')?.setAttribute('disabled', 'true');
        });
        it('should set the disabled property to true', () => {
          expect(element.hasAttribute('disabled')).to.be.true;
        });
      });
    });

    describe('when an input is disabled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-input>
            <input disabled />
          </fake-input>`
        );
      });
      it('should reflect the disabled attribute on the host element', () => {
        expect(element?.getAttribute('disabled')).to.exist;
      });
    });
  });
});
