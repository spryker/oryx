import {
  CLOSE_POPOVER_ATTR,
  PopoverController,
  PopoverOptions,
  PopoverSelectEvent,
} from '@spryker-oryx/ui/popover';
import { SearchEventDetail } from '@spryker-oryx/ui/searchbox';
import { LitElement, ReactiveController, TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { OptionComponent } from '../../../../form/option';
import { getControl } from '../../../../form/utilities/getControl';
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
        //ensure that option has necessary attribute for closing popover
        option.toggleAttribute(CLOSE_POPOVER_ATTR, true);

        if (!option.slot) option.slot = 'option';
      });

    if (!this.lastValue && this.control.value)
      this.lastValue = this.control.value;

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
                <oryx-spinner></oryx-spinner>
              </div>`
          )}
        </slot>
      </oryx-popover>
    `;
  }

  protected onInput(): void {
    const query = this.typeaheadControl?.value || this.control.value;
    const event = new CustomEvent<SearchEventDetail>('oryx.typeahead', {
      detail: {
        query,
      },
      bubbles: true,
      composed: true,
    });
    this.host.dispatchEvent(event);
  }

  protected onChange(): void {
    const value = this.control.value;
    this.popoverController.selectByValue(value, this.lastValue === value);
    if (value === '') this.lastValue = undefined;
  }

  protected onSelect(e: CustomEvent<PopoverSelectEvent>): void {
    if (e.detail.selected) {
      const value = this.getValue(e.detail.selected);
      const text = this.getText(e.detail.selected);
      if (!value) return;

      // the control value might have been reset during filtering, hence we'll set it always
      this.control.value = value;
      this.control.dispatchEvent(
        new Event(
          this.control instanceof HTMLSelectElement ? 'change' : 'input',
          { bubbles: true, composed: true }
        )
      );
      if (text && this.typeaheadControl) this.typeaheadControl.value = text;
    }
  }

  protected get control(): HTMLInputElement | HTMLSelectElement {
    return getControl(this.host);
  }

  protected get typeaheadControl(): HTMLInputElement | null {
    return this.host.renderRoot?.querySelector<HTMLInputElement>(
      '[typeaheadInput]'
    );
  }

  protected getValue(option: HTMLElement): string | undefined {
    return (option as OptionComponent).value;
  }

  protected getText(option: HTMLElement): string | undefined {
    return (option as OptionComponent).innerText?.trim();
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
