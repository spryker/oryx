import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { getControl } from '../../../../form/utilities/getControl';
import { OptionComponent } from '../../../../option';
import {
  PopoverController,
  PopoverOptions,
  PopoverSelectEvent,
} from '../../../../popover';
import { SearchEvent } from '../../../searchbox';
import { TypeaheadOptions } from '../typeahead.model';
import { FilterController } from './filter.controller';

const emptyFallback = 'No results found';

export class TypeaheadController implements ReactiveController {
  protected filterController: FilterController;
  protected popoverController: PopoverController;

  protected lastValue?: string;

  hostConnected(): void {
    this.host.addEventListener('input', this.onInput);
    this.host.addEventListener('change', this.onChange);
    this.host.addEventListener('oryx.select', this.onSelect as EventListener);
  }

  hostDisconnected(): void {
    this.host.removeEventListener('input', this.onInput);
    this.host.removeEventListener('change', this.onChange);
    this.host.removeEventListener(
      'oryx.select',
      this.onSelect as EventListener
    );
  }

  hostUpdated(): void {
    this.host
      .querySelectorAll<OptionComponent>('oryx-option')
      .forEach((option) => {
        if (!option.slot) {
          option.slot = 'option';
        }
      });

    if (!this.lastValue && this.control.value) {
      this.lastValue = this.control.value;
    }

    this.onChange();
  }

  renderPopover(): TemplateResult {
    return html`
      <oryx-popover>
        ${when(!this.host.isEmpty, () => html`<slot name="option"></slot>`)}
        <slot name="empty">
          ${when(
            this.host.isEmpty,
            () =>
              html`<div class="placeholder">
                ${this.host.emptyMessage ?? emptyFallback}
              </div>`
          )}
        </slot>
        <slot name="loading">
          ${when(
            this.host.isLoading,
            () =>
              html`<div class="placeholder">
                <oryx-icon type="loader"></oryx-icon>
              </div>`
          )}
        </slot>
      </oryx-popover>
    `;
  }

  protected onInput(): void {
    const event = new CustomEvent<SearchEvent>('oryx.typeahead', {
      detail: {
        query: this.control.value,
      },
      bubbles: true,
      composed: true,
    });
    this.host.dispatchEvent(event);
  }

  protected onChange(): void {
    const value = this.control.value;
    this.popoverController.selectByValue(value, this.lastValue === value);
    if (value === '') {
      this.lastValue = undefined;
    }
  }

  protected onSelect(e: CustomEvent<PopoverSelectEvent>): void {
    if (e.detail.selected) {
      const value = this.getValue(e.detail.selected);
      if (!value) {
        return;
      }
      // the control value might have been reset during filtering, hence we'll set it always
      this.control.value = value;
      if (this.lastValue !== value) {
        this.lastValue = value;
        this.control.dispatchEvent(
          new Event(
            this.control instanceof HTMLSelectElement ? 'change' : 'input',
            { bubbles: true, composed: true }
          )
        );
      }
    }
  }

  protected get control(): HTMLInputElement | HTMLSelectElement {
    return getControl(this.host);
  }

  protected getValue(option: HTMLElement): string | undefined {
    return (option as OptionComponent).value;
  }

  constructor(
    protected host: TypeaheadOptions & LitElement,
    protected options?: PopoverOptions
  ) {
    this.host.addController(this);
    this.filterController = new FilterController(host);
    this.popoverController = new PopoverController(host, options);

    this.onInput = this.onInput.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }
}
