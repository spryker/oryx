import { fixture, html } from '@open-wc/testing-helpers';
import { a11yConfig } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SpyInstance } from 'vitest';
import { getControl } from '../../../utilities/getControl';
import { FormControlController } from './form-control.controller';
import { FormControlOptions } from './form-control.model';

@customElement('fake-input')
class InputComponent extends LitElement implements FormControlOptions {
  protected formControlController = new FormControlController(this);

  @property() label?: string;
  @property() errorMessage?: string;

  protected override render(): TemplateResult {
    return html`${this.formControlController.render()}`;
  }
}

describe('FormControlController', () => {
  let element: InputComponent;

  describe('control', () => {
    describe('when no input is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-input label="some label"></fake-input>`
        );
      });

      it('should throw an error', () => {
        expect(() => getControl(element)).toThrowError();
      });
    });

    describe('when an input is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-input label="some label">
          <input id="light" />
        </fake-input>`);
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('is should render light dom', () => {
        expect(getControl(element)).toEqual(
          element.querySelector('input#light')
        );
      });
    });

    describe('when slot content is changed', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-input label="some label"><input /></fake-input>`
        );
        (
          element.renderRoot.querySelector(
            'slot:not([name])'
          ) as HTMLSlotElement
        ).dispatchEvent(new Event('slotchange'));
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not set the disabled property', () => {
        expect(element?.hasAttribute('disabled')).toBe(false);
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

    describe('when the mousedown event is dispatched on the host element', () => {
      let spy: SpyInstance<Event[]>;
      const event = new Event('mousedown', { bubbles: true });

      beforeEach(async () => {
        spy = vi.spyOn(event, 'preventDefault');
        element.dispatchEvent(event);
      });

      it('should stop immediate propagation of the event', () => {
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('when a non-focusable element is clicked', () => {
      beforeEach(async () => {
        element
          .querySelector('#notFocusable')
          ?.dispatchEvent(new Event('mousedown', { bubbles: true }));
      });

      it('should focus the control', () => {
        expect(document.activeElement).toEqual(getControl(element));
      });
    });

    describe('when a focusable element is clicked', () => {
      beforeEach(async () => {
        element
          .querySelector<HTMLButtonElement>('#focusable')
          ?.dispatchEvent(new Event('mousedown', { bubbles: true }));
      });

      it('should not focus the control', () => {
        expect(document.activeElement).not.toEqual(getControl(element));
      });
    });
  });

  describe('disabled', () => {
    describe('when an input is not disabled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-input label="some label"><input /></fake-input>`
        );
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not set the disabled property', () => {
        expect(element.hasAttribute('disabled')).toBe(false);
      });

      describe('but when it is disabled afterwards', () => {
        beforeEach(async () => {
          element.querySelector('input')?.setAttribute('disabled', 'true');
        });
        it('should set the disabled property to true', () => {
          expect(element.hasAttribute('disabled')).toBe(true);
        });
      });
    });

    describe('when an input is disabled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-input label="some label">
            <input disabled />
          </fake-input>`
        );
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should reflect the disabled attribute on the host element', () => {
        expect(element?.getAttribute('disabled')).not.toBeNull();
      });
    });
  });

  describe('when "floatLabel" prop is provided', () => {
    describe('when input has no value', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-input label="some label" floatLabel><input /></fake-input>`
        );
      });

      it('should not have "has-value" attribute', () => {
        expect(element.hasAttribute('has-value')).toBe(false);
      });
    });

    describe('when input has value', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-input label="some label" floatLabel
            ><input value="value"
          /></fake-input>`
        );
      });

      it('should have "has-value" attribute', () => {
        expect(element.hasAttribute('has-value')).toBe(true);
      });
    });
  });

  describe('when input is invalid', () => {
    let control: HTMLInputElement;

    beforeEach(async () => {
      element = await fixture(html`<fake-input><input /></fake-input>`);

      control = element.querySelector('input') as HTMLInputElement;

      control.dispatchEvent(new Event('invalid'));
    });

    it('should set "hasError" attribute', () => {
      expect(element.hasAttribute('hasError')).toBe(true);
    });

    describe('and input value changes', () => {
      beforeEach(async () => {
        control.dispatchEvent(new InputEvent('input'));
      });

      it('should remove "hasError" attribute', () => {
        expect(element.hasAttribute('hasError')).toBe(false);
      });
    });
  });
});
