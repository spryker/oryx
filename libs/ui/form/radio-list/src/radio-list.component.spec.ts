import { fixture, html } from '@open-wc/testing-helpers';
import { ErrorMessageComponent } from '../../../error-message';
import './index';
import { RadioListComponent } from './radio-list.component';

describe('RadioListComponent', () => {
  let element: RadioListComponent | undefined;

  describe('when list has no heading', () => {
    beforeEach(async () => {
      element = await fixture<RadioListComponent>(
        html`<oryx-radio-list>
          <oryx-radio><input name="group" type="radio" /> Option 1</oryx-radio>
          <oryx-radio><input name="group" type="radio" /> Option 2</oryx-radio>
        </oryx-radio-list>`
      );
    });

    it('should have no heading', () => {
      const legend = element?.shadowRoot?.querySelector('legend');

      expect(legend?.getAttribute('hasHeading')).toBeNull();
    });
  });

  describe('when list has a heading', () => {
    describe('provided as an attribute', () => {
      beforeEach(async () => {
        element = await fixture<RadioListComponent>(
          html`<oryx-radio-list heading="title">
            <oryx-radio
              ><input name="group" type="radio" /> Option 1</oryx-radio
            >
            <oryx-radio
              ><input name="group" type="radio" /> Option 2</oryx-radio
            >
          </oryx-radio-list>`
        );
      });

      it('should have a heading', () => {
        const legend = element?.shadowRoot?.querySelector('legend');

        expect(legend?.getAttribute('hasHeading')).not.toBeNull();
        expect(legend?.textContent?.trim()).toEqual('title');
      });
    });

    describe('provided as a custom element', () => {
      beforeEach(async () => {
        element = await fixture<RadioListComponent>(
          html`<oryx-radio-list>
            <span slot="heading">title</span>
            <oryx-radio
              ><input name="group" type="radio" /> Option 1</oryx-radio
            >
            <oryx-radio
              ><input name="group" type="radio" /> Option 2</oryx-radio
            >
          </oryx-radio-list>`
        );
      });

      it('should have a heading flag', () => {
        const legend = element?.shadowRoot?.querySelector('legend');
        const [heading] = legend
          ?.querySelector('slot')
          ?.assignedElements() as Element[];

        expect(legend?.getAttribute('hasHeading')).not.toBeNull();
        expect(heading?.textContent?.trim()).toEqual('title');
      });
    });
  });

  describe('when list has an error provided', () => {
    let errorMessage: ErrorMessageComponent | null;

    beforeEach(async () => {
      element = await fixture<RadioListComponent>(
        html`<oryx-radio-list errorMessage="error">
          <oryx-radio><input name="group" type="radio" /> Option 1</oryx-radio>
          <oryx-radio><input name="group" type="radio" /> Option 2</oryx-radio>
        </oryx-radio-list>`
      );
      errorMessage =
        element?.renderRoot?.querySelector('oryx-error-message') || null;
    });

    it('the host should have hasError attribute', () => {
      expect(element?.hasAttribute('hasError')).toBe(true);
    });

    it('should pass error message to component', () => {
      expect(errorMessage?.message).toEqual('error');
    });

    it('radios should have hasError attribute', () => {
      const radios = element?.querySelectorAll('oryx-radio');
      radios?.forEach((el) => expect(el.hasAttribute('hasError')).toBe(true));
    });
  });
});
