import { AlertType } from '@spryker-oryx/ui';
import { i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import {
  FacetValueNavigationComponentAttributes,
  FACET_CLEAR_EVENT,
  FACET_TOGGLE_EVENT,
  ShowFacet,
} from './facet-value-navigation.model';
import { facetValueNavigationStyles } from './facet-value-navigation.styles';
import { DirectiveResult } from 'lit/async-directive';

export class SearchFacetValueNavigationComponent
  extends LitElement
  implements FacetValueNavigationComponentAttributes
{
  static styles = facetValueNavigationStyles;

  @property() heading?: string;
  @property({ type: Number }) valuesLength?: number;
  @property({ type: Number }) selectedLength?: number;
  @property({ type: Boolean }) enableToggle?: boolean;
  @property({ type: Boolean }) enableSearch?: boolean;
  @property({ type: Boolean }) open?: boolean;
  @property({ type: Boolean }) enableClearAction?: boolean;

  @state() protected _isShowed = false;

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
    const allowClear = this.enableClearAction && this.selectedLength;

    return html` <oryx-collapsible
      ?open=${this.open}
      ?nonTabbable=${allowClear}
    >
      <section slot="header">
        <slot name="title">${this.heading}</slot>

        ${when(
          this.selectedLength,
          () => html` <oryx-chip dense appearance=${AlertType.Success}
            >${this.selectedLength}</oryx-chip
          >`
        )}

        ${when(
          allowClear,
          () =>
            html`
              <oryx-button type="text" size=${Size.Sm}>
                <button @click=${this.onClear}>
                  ${i18n('search.facet-value-navigation.clear')}
                </button>
              </oryx-button>
            `
        )}
      </section>

      ${when(
        this.enableSearch,
        () =>
          html`<oryx-search>
            <input .placeholder=${this.searchPlaceholder} />
          </oryx-search>`
      )}

      <slot></slot>

      ${when(
        this.enableToggle,
        () => html`
          <oryx-button type="text" size=${Size.Lg}>
            <button @click=${this.onToggle}>
              ${when(
                this._isShowed,
                () => i18n('search.facet-value-navigation.show-less'),
                () => i18n('search.facet-value-navigation.show-all')
              )}
              ${when(
                this.valuesLength && !this._isShowed,
                () => html`(${this.valuesLength})`
              )}
            </button>
          </oryx-button>`
      )}
    </oryx-collapsible>`;
  }

  protected get searchPlaceholder(): DirectiveResult {
    return i18n('oryx.search.search-<heading>', {heading: this?.heading?.toLowerCase() ?? ''})
  }
}
