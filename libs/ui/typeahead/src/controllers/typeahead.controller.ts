import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { getControl } from '../../../input/src/util';
import { OptionComponent } from '../../../option';
import {
  PopoverController,
  PopoverOptions,
  PopoverSelectEvent,
} from '../../../popover';
import { SearchEvent } from '../../../search';
import { TypeaheadOptions } from '../typeahead.model';
import { FilterController } from './filter.controller';

const emptyFallback = 'No results found';

export class TypeaheadController implements ReactiveController {
  protected filterController: FilterController;
  protected popoverController: PopoverController;

  hostConnected(): void {
    this.host.addEventListener('input', this.inputEventHandler);
    this.host.addEventListener('change', this.changeEventHandler);
    this.host.addEventListener(
      'oryx.select',
      this.selectEventHandler as EventListener
    );
  }

  hostDisconnected(): void {
    this.host.removeEventListener('input', this.inputEventHandler);
    this.host.removeEventListener('change', this.changeEventHandler);
    this.host.removeEventListener(
      'oryx.select',
      this.selectEventHandler as EventListener
    );
  }

  hostUpdated(): void {
    this.changeEventHandler();
    this.host
      .querySelectorAll<OptionComponent>('oryx-option')
      .forEach((option) => {
        if (!option.slot) {
          option.slot = 'option';
        }
      });

    if (this.control.value) {
      this.popoverController.selectByValue(this.control.value);
    }
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

  protected inputEventHandler(): void {
    const event = new CustomEvent<SearchEvent>('oryx.typeahead', {
      detail: {
        query: this.control.value,
      },
      bubbles: true,
      composed: true,
    });
    this.host.dispatchEvent(event);
  }

  protected changeEventHandler(): void {
    const control = this.control;
    if (control.value === '') {
      return;
    }
    this.popoverController.selectByValue(control.value);
  }

  protected selectEventHandler(e: CustomEvent<PopoverSelectEvent>): void {
    this.control.dispatchEvent(
      new Event('input', { bubbles: true, composed: true })
    );
    this.control.dispatchEvent(
      new Event('change', { bubbles: true, composed: true })
    );
    this.handleSelect(e);
  }

  protected handleSelect(e: CustomEvent<PopoverSelectEvent>): void {
    const control = this.control;
    if (e.detail.selected) {
      const value = this.getValue(e.detail.selected);
      if (value) {
        control.value = value;
        control.dispatchEvent(new Event('change', { bubbles: true }));
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

    this.inputEventHandler = this.inputEventHandler.bind(this);
    this.changeEventHandler = this.changeEventHandler.bind(this);
    this.selectEventHandler = this.selectEventHandler.bind(this);
  }
}
