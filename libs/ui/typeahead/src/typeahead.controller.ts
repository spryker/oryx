import { html, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { getControl } from '../../input/src/util';
import { PopoverSelectEvent } from '../../popover';
import { SearchEvent } from '../../search';
import { OryxElement } from '../../utilities';
import { TypeaheadOptions } from './typeahead.model';

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

  renderPopover(): TemplateResult {
    return html`
      <oryx-popover>
        <slot name="option">
          <slot name="empty">
            <div class="placeholder">
              ${when(
                this.host.options.isEmpty,
                () => html` ${this.host.options.emptyMessage ?? emptyFallback} `
              )}
            </div>
          </slot>
        </slot>
        <slot name="loading">
          ${when(
            this.host.options.isLoading,
            () => html`<div><oryx-icon type="loader"></oryx-icon></div>`
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
      control.value = this.getValue(ev.detail.selected);
      control.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  protected getValue(option: HTMLElement): string {
    return option.getAttribute('value') ?? option.innerText;
  }

  constructor(protected host: OryxElement<TypeaheadOptions>) {
    this.host.addController(this);
  }
}
