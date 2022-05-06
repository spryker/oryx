import { fixture, fixtureCleanup, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing/a11y';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SpyInstance } from 'vitest';
import { a11yConfig } from '../../../../a11y';
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

  afterEach(() => fixtureCleanup());

  describe('control', () => {
    describe('when no input is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-input label="some label"></fake-input>`
        );
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should render the fallback input from shadow dom', () => {
        expect(getControl(element)).toEqual(
          element.renderRoot.querySelector('input')
        );
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
        expect(element?.getAttribute('disabled')).toBeDefined();
      });
    });
  });
});
