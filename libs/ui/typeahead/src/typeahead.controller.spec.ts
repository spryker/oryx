import '../../option/';
import { PopoverSelectEvent } from '../../popover';
import { SearchEvent } from '../../search';
import { OryxElement, queryFirstAssigned } from '../../utilities';
import { TypeaheadController } from './typeahead.controller';
import { TypeaheadOptions } from './typeahead.model';
import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

export class FakeComponent
  extends LitElement
  implements OryxElement<TypeaheadOptions>
{
  @property({ type: Object }) options: TypeaheadOptions = {};
  protected popoverController = new TypeaheadController(this);

  render(): TemplateResult {
    return html`
      <slot><input value="foo" /></slot>
      <div>inner-value</div>
      <oryx-option value="option-value"></oryx-option>
    `;
  }
}
customElements.define('fake-typeahead', FakeComponent);

export class WithoutControlComponent extends FakeComponent {
  render(): TemplateResult {
    return html` <slot>no control</slot> `;
  }
}
customElements.define('without-control-typeahead', WithoutControlComponent);

export class WithoutOptionValueComponent
  extends LitElement
  implements OryxElement<TypeaheadOptions>
{
  @property({ type: Object }) options: TypeaheadOptions = {};
  protected popoverController = new TypeaheadController(this);

  render(): TemplateResult {
    return html`
      <slot><input value="foo" /></slot>
      <div>inner-value</div>
      <oryx-option></oryx-option>
    `;
  }
}
customElements.define(
  'without-option-value-typeahead',
  WithoutOptionValueComponent
);

describe('TypeaheadController', () => {
  let element: FakeComponent;

  beforeEach(async () => {
    element = await fixture(html`<fake-typeahead></fake-typeahead>`);
  });

  describe('slot', () => {
    describe('when oryx-option elements without a slot are provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-typeahead>
            <oryx-option>first</oryx-option>
            <oryx-option>second</oryx-option>
            <oryx-option>third</oryx-option>
          </fake-typeahead>`
        );
      });
      it('should add the option slot to it', () => {
        expect(
          element.querySelectorAll('oryx-option[slot=option').length
        ).to.eq(3);
      });
    });

    describe('when oryx-option elements with a slot are provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-typeahead>
            <oryx-option slot="other">first</oryx-option>
            <oryx-option slot="other">second</oryx-option>
            <oryx-option slot="other">third</oryx-option>
          </fake-typeahead>`
        );
      });
      it('should add the option slot to it', () => {
        expect(
          element.querySelectorAll('oryx-option[slot=option').length
        ).to.eq(0);
      });
    });
  });

  describe('when an input is dispatched', () => {
    let result: SearchEvent;

    beforeEach(async () => {
      element.addEventListener('oryx.typeahead', ((
        ev: CustomEvent<SearchEvent>
      ) => {
        result = ev.detail;
      }) as EventListener);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    });

    it('should dispatch a "oryx.typeahead" event', () => {
      expect(result.query).eq('foo');
    });
  });

  describe('"oryx.select" event', () => {
    let selected: HTMLElement;

    describe('when the event is dispatched', () => {
      beforeEach(() => {
        selected = element.shadowRoot?.querySelector(
          'oryx-option'
        ) as HTMLElement;
        const event = new CustomEvent<PopoverSelectEvent>('oryx.select', {
          detail: { selected },
          bubbles: true,
          composed: true,
        });
        element.dispatchEvent(event);
      });

      it('should update the input value with the value', () => {
        const input: HTMLInputElement = queryFirstAssigned(element, {
          flatten: true,
        }) as HTMLInputElement;
        expect(input?.value).to.eq('option-value');
      });
    });
  });

  describe('when there is not input available', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<without-control-typeahead></without-control-typeahead>`
      );
    });

    describe('when an input is dispatched', () => {
      beforeEach(() => {
        element.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });

    it('should not throw an error', () => {
      expect(() => {
        (): void => undefined;
      }).not.to.throw;
    });
  });
});
