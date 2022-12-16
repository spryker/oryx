import { i18n } from '@spryker-oryx/utilities/i18n';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { property, state } from 'lit/decorators.js';
import {
  FACET_CLEAR_EVENT,
  FACET_SEARCH_EVENT,
  FACET_TOGGLE_EVENT,
  SearchFacet,
  ShowFacet,
} from './facet-value-navigation.model';
import { FacetControlStyles } from './facet-value-navigation.styles';

export class SearchFacetValueNavigationComponent extends LitElement {
  static styles = FacetControlStyles;

  @property() heading?: string;
  @property({ type: Number }) valuesLength?: number;
  @property({ type: Number }) selectedLength?: number;
  @property({ type: Boolean }) enableToggle?: boolean;
  @property({ type: Boolean }) enableSearch?: boolean;
  @property({ type: Boolean }) open?: boolean;

  @state() protected _isShowed = false;

  protected onSearch(e: InputEvent): void {
    const { value } = e.target as HTMLInputElement;

    this.dispatchEvent(
      new CustomEvent<SearchFacet>(FACET_SEARCH_EVENT, {
        bubbles: true,
        composed: true,
        detail: { value },
      })
    );
  }

  protected onToggle(): void {
    this._isShowed = !this._isShowed;

    this.dispatchEvent(
      new CustomEvent<ShowFacet>(FACET_TOGGLE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { isShowed: this._isShowed },
      })
    );
  }

  protected onClear(): void {
    this.dispatchEvent(
      new CustomEvent(FACET_CLEAR_EVENT, { bubbles: true, composed: true })
    );
  }

  protected override render(): TemplateResult {
    return html` <oryx-collapsible ?open=${this.open}>
      <span class="header" slot="header">
        <slot name="title">
          ${when(this.heading, () => html`${this.heading}`)}
          ${when(
            this.selectedLength,
            () =>
              html`<oryx-chip dense appearance="success"
                >${this.selectedLength}</oryx-chip
              >`
          )}
        </slot>

        ${when(
          this.selectedLength,
          () =>
            html`
              <oryx-button type="text" size="small">
                <button @click=${this.onClear}>
                  ${i18n('search.facet-value-navigation.clear')}
                </button>
              </oryx-button>
            `
        )}
      </span>

      ${when(
        this.enableSearch,
        () => html`<oryx-input>
          <oryx-icon type="search" size="medium"></oryx-icon>
          <input type="text" @input=${this.onSearch} />
        </oryx-input>`
      )}

      <slot></slot>

      ${when(
        this.enableToggle,
        () => html`<div class="controls">
          <oryx-button type="text" size="large">
            <button @click=${this.onToggle}>
              ${when(
                this._isShowed,
                () => i18n('search.facet-value-navigation.hide-all'),
                () => i18n('search.facet-value-navigation.show-all')
              )}
              ${when(
                this.valuesLength && !this._isShowed,
                () => html`(${this.valuesLength})`
              )}
            </button>
          </oryx-button>
        </div>`
      )}
    </oryx-collapsible>`;
  }
}
