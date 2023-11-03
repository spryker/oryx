import { TypeaheadOptions } from '@spryker-oryx/ui/typeahead';
import { html, LitElement, ReactiveController, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { getControl } from '../../../utilities';

export class SelectFilterController implements ReactiveController {
  private initialized = false;

  hostConnected(): void {
    this.host.addEventListener('change', this.onUpdate);
    this.host.addEventListener('mousedown', this.onFocus);
    this.host.addEventListener('focusin', this.onFocus);
  }

  hostDisconnected(): void {
    this.host.removeEventListener('change', this.onUpdate);
    this.host.removeEventListener('mousedown', this.onFocus);
    this.host.removeEventListener('focusin', this.onFocus);
  }

  hostUpdated(): void {
    this.host.toggleAttribute('filterSelect', this.selectFilteringEnabled);
    this.onUpdate();
  }

  render(): TemplateResult {
    return html`${when(
      !!this.host.filterStrategy,
      () => html`<input filterInput />`
    )}`;
  }

  protected onFocus(): void {
    if (this.selectFilteringEnabled) this.filterControl.focus();
  }

  protected onUpdate(): void {
    if (this.selectFilteringEnabled) {
      this.setPlaceholder();
      this.setFilterValue();
      this.initialized = true;
    }
  }

  protected setPlaceholder(): void {
    const placeholder = (this.options.length && this.options[0].text) || '';
    this.filterControl.setAttribute('placeholder', placeholder);
  }

  protected setFilterValue(): void {
    if (this.initialized && this.host.isEmpty && !!this.filterControl.value)
      return;

    const value = this.control.value;
    const selected = value
      ? Array.from(this.options).find((option) => option.value === value)
      : undefined;
    this.filterControl.value = selected?.text || '';
  }

  protected get selectFilteringEnabled(): boolean {
    return (
      !!this.host.filterStrategy && this.control instanceof HTMLSelectElement
    );
  }

  protected get control(): HTMLSelectElement {
    return getControl(this.host);
  }

  protected get options(): NodeListOf<HTMLOptionElement> {
    return this.control.querySelectorAll('option');
  }

  protected get filterControl(): HTMLInputElement {
    return this.host.renderRoot.querySelector(
      '[filterInput]'
    ) as HTMLInputElement;
  }

  constructor(protected host: LitElement & TypeaheadOptions) {
    this.host.addController(this);

    this.onUpdate = this.onUpdate.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }
}
