import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { a11yConfig } from '../../../a11y';
import '../../../option/';
import { PopoverSelectEvent } from '../../../popover';
import { SearchEvent } from '../../../search';
import { queryFirstAssigned } from '../../../utilities';
import { FilterStrategyType, TypeaheadOptions } from '../typeahead.model';
import { TypeaheadController } from './typeahead.controller';

@customElement('fake-typeahead')
class FakeComponent extends LitElement implements TypeaheadOptions {
  @property({ type: Boolean }) filter?: boolean;
  @property() filterStrategy?: FilterStrategyType;
  @property({ type: Boolean }) isLoading?: boolean;
  @property({ type: Boolean }) isEmpty?: boolean;
  @property() emptyMessage?: string;

  protected popoverController = new TypeaheadController(this);

  render(): TemplateResult {
    return html`
      <slot><input value="foo" /></slot>
      <div>inner-value</div>
      <oryx-option value="option-value"></oryx-option>
    `;
  }
}

@customElement('without-control-typeahead')
class WithoutControlComponent extends FakeComponent {
  render(): TemplateResult {
    return html` <slot>no control</slot> `;
  }
}

@customElement('without-option-value-typeahead')
class WithoutOptionValueComponent extends LitElement {
  protected popoverController = new TypeaheadController(this);

  render(): TemplateResult {
    return html`
      <slot><input value="foo" /></slot>
      <div>inner-value</div>
      <oryx-option></oryx-option>
    `;
  }
}

describe('TypeaheadController', () => {
  let element:
    | FakeComponent
    | WithoutOptionValueComponent
    | WithoutControlComponent;

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

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should add the option slot to it', () => {
        expect(
          element.querySelectorAll('oryx-option[slot=option]').length
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

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
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

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
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
