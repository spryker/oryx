import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { PopoverSelectEvent } from '../../popover';
import { SearchEvent } from '../../search';
import { OryxElement, queryFirstAssigned } from '../../utilities';
import { TypeaheadController } from './typeahead.controller';
import { TypeaheadOptions } from './typeahead.model';

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

describe('TypeaheadController', () => {
  let element: FakeComponent;

  beforeEach(async () => {
    element = await fixture(html`<fake-typeahead></fake-typeahead>`);
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

    describe('when the option is a oryx-option element', () => {
      beforeEach(() => {
        selected = element.shadowRoot?.querySelector(
          'oryx-option'
        ) as HTMLElement;
      });

      describe('and the event is dispatched', () => {
        beforeEach(() => {
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

    describe('when the option is a regular div', () => {
      beforeEach(() => {
        selected = element.shadowRoot?.querySelector('div') as HTMLElement;
      });
      describe('and the event is dispatched', () => {
        beforeEach(() => {
          const event = new CustomEvent<PopoverSelectEvent>('oryx.select', {
            detail: { selected },
            bubbles: true,
            composed: true,
          });
          element.dispatchEvent(event);
        });

        it('should update the input value with the innerHTML', () => {
          const input: HTMLInputElement = queryFirstAssigned(element, {
            flatten: true,
          }) as HTMLInputElement;
          expect(input?.value).to.eq('inner-value');
        });
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
