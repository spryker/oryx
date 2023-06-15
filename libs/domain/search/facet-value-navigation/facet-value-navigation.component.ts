import { AlertType } from '@spryker-oryx/ui';
import { i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/async-directive';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import {
  FACET_CLEAR_EVENT,
  FACET_TOGGLE_EVENT,
  SearchFacetValueNavigationComponentAttributes,
  ToggleFacetEventDetail,
} from './facet-value-navigation.model';
import { facetValueNavigationStyles } from './facet-value-navigation.styles';

export class SearchFacetValueNavigationComponent
  extends LitElement
  implements SearchFacetValueNavigationComponentAttributes
{
  static styles = facetValueNavigationStyles;

  @property() heading?: string;
  @property({ type: Number }) valuesLength?: number;
  @property({ type: Number }) selectedLength?: number;
  @property({ type: Boolean }) enableToggle?: boolean;
  @property({ type: Boolean }) enableSearch?: boolean;
  @property({ type: Boolean }) open?: boolean;
  @property({ type: Boolean }) enableClear?: boolean;

  @state() protected expanded = false;

  protected override render(): TemplateResult {
    const allowClear = this.enableClear && this.selectedLength;

    return html` <oryx-collapsible
      ?open=${this.open}
      ?nonTabbable=${allowClear}
    >
      <section slot="heading">
        <slot name="heading">${this.heading}</slot>

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
                  ${i18n('oryx.search.facets.clear')}
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
        () => html` <oryx-button type="text" size=${Size.Lg}>
          <button @click=${this.onToggle}>
            ${when(
              this.expanded,
              () => i18n('oryx.search.facets.show-less'),
              () =>
                i18n('oryx.search.facets.show-all-<length>', {
                  length: this.valuesLength ? `(${this.valuesLength})` : '',
                })
            )}
          </button>
        </oryx-button>`
      )}
    </oryx-collapsible>`;
  }

  protected onToggle(): void {
    this.expanded = !this.expanded;

    this.dispatchEvent(
      new CustomEvent<ToggleFacetEventDetail>(FACET_TOGGLE_EVENT, {
        bubbles: true,
        composed: true,
        detail: { expanded: this.expanded },
      })
    );
  }

  protected onClear(): void {
    this.dispatchEvent(
      new CustomEvent(FACET_CLEAR_EVENT, { bubbles: true, composed: true })
    );
  }

  protected get searchPlaceholder(): DirectiveResult {
    return i18n('oryx.search.search-<heading>', {
      heading: this?.heading?.toLowerCase() ?? '',
    });
  }
}
