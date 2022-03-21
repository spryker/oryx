import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { getControl } from '../../input/src/util';
import { OptionComponent } from '../../option';
import { PopoverSelectEvent } from '../../popover';
import { SearchEvent } from '../../search';
import { FilterController } from './filter.controller';
import { TypeaheadOptions } from './typeahead.model';

const emptyFallback = 'No results found';
export class TypeaheadController implements ReactiveController {
  protected filterController: FilterController;

  hostConnected(): void {
    this.host.addEventListener('input', () => {
      this.triggerTypeAhead();
    });

    this.host.addEventListener('oryx.select', ((
      ev: CustomEvent<PopoverSelectEvent>
    ) => {
      this.control?.dispatchEvent(
        new Event('input', { bubbles: true, composed: true })
      );
      this.control?.dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      );
      this.handleSelect(ev);
    }) as EventListener);
  }

  hostUpdated(): void {
    this.host
      .querySelectorAll<OptionComponent>('oryx-option')
      .forEach((option) => {
        if (!option.slot) {
          option.slot = 'option';
        }
      });
  }

  renderPopover(): TemplateResult {
    return html`
      <oryx-popover>
        <slot name="option"></slot>
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

  protected triggerTypeAhead(): void {
    const control = this.control;
    if (control) {
      const event = new CustomEvent<SearchEvent>('oryx.typeahead', {
        detail: {
          query: control.value,
        },
        bubbles: true,
        composed: true,
      });
      this.host.dispatchEvent(event);
    }
  }

  protected handleSelect(ev: CustomEvent<PopoverSelectEvent>): void {
    const control = this.control;
    if (control) {
      const value = this.getValue(ev.detail.selected);
      if (value) {
        control.value = value;
        control.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  protected get control(): HTMLInputElement | HTMLSelectElement | undefined {
    return getControl(this.host);
  }

  protected getValue(option: HTMLElement): string | undefined {
    return (option as OptionComponent).value;
  }

  constructor(protected host: TypeaheadOptions & LitElement) {
    this.host.addController(this);
    this.filterController = new FilterController(host);
  }
}
