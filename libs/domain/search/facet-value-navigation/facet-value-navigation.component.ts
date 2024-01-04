import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { AlertType } from '@spryker-oryx/ui';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { I18nMixin, featureVersion } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { DirectiveResult } from 'lit/async-directive';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import {
  FACET_CLEAR_EVENT,
  FACET_TOGGLE_EVENT,
  FacetValueNavigationOption,
  SearchFacetValueNavigationComponentAttributes,
  ToggleFacetEventDetail,
} from './facet-value-navigation.model';
import { facetValueNavigationStyles } from './facet-value-navigation.styles';

@defaultOptions({ syncCollapsibleState: true })
export class SearchFacetValueNavigationComponent
  extends ContentMixin<FacetValueNavigationOption>(I18nMixin(LitElement))
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
  @property({ type: Boolean }) dirty?: boolean;

  @state() protected expanded = false;

  protected override render(): TemplateResult {
    const allowClear =
      this.enableClear &&
      (featureVersion >= '1.2' ? this.dirty : this.selectedLength);

    const syncKey = this.$options().syncCollapsibleState
      ? this.heading?.replace(' ', '-').toLowerCase()
      : undefined;

    return html` <oryx-collapsible
      ?open=${this.open}
      ?nonTabbable=${allowClear}
      .syncKey=${syncKey}
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
              <oryx-button
                .type=${ButtonType.Text}
                .size=${ButtonSize.Sm}
                .text=${this.i18n('oryx.search.facets.clear')}
                @click=${this.onClear}
              ></oryx-button>
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
        () => html` <oryx-button
          .type=${ButtonType.Text}
          .size=${ButtonSize.Lg}
          @click=${this.onToggle}
        >
          ${when(
            this.expanded,
            () => this.i18n('oryx.search.facets.show-less'),
            () =>
              this.i18n('oryx.search.facets.show-all-<length>', {
                length: this.valuesLength ? `(${this.valuesLength})` : '',
              })
          )}
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
    return this.i18n('oryx.search.search-<heading>', {
      heading: this?.heading?.toLowerCase() ?? '',
    });
  }
}
