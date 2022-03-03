import { getControl } from '../../input/src/util';
import { OptionComponent } from '../../option';
import { PopoverSelectEvent } from '../../popover';
import { SearchEvent } from '../../search';
import { OryxElement } from '../../utilities';
import { TypeaheadOptions } from './typeahead.model';
import { html, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';

const emptyFallback = 'No results found';
export class TypeaheadController implements ReactiveController {
  hostConnected(): void {
    this.host.addEventListener('input', (() => {
      this.triggerTypeAhead();
    }) as EventListener);

    this.host.addEventListener('oryx.select', ((
      ev: CustomEvent<PopoverSelectEvent>
    ) => {
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
            this.host.options.isEmpty,
            () =>
              html`<div class="placeholder">
                ${this.host.options.emptyMessage ?? emptyFallback}
              </div>`
          )}
        </slot>
        <slot name="loading">
          ${when(
            this.host.options.isLoading,
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
    const control = getControl(this.host);
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
    const control = getControl(this.host);
    if (control) {
      const value = this.getValue(ev.detail.selected);
      if (value) {
        control.value = value;
        control.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  protected getValue(option: HTMLElement): string | undefined {
    return (option as OptionComponent).value;
  }

  constructor(protected host: OryxElement<TypeaheadOptions>) {
    this.host.addController(this);
  }
}
