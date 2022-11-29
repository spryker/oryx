import {
  ComponentMixin,
  ContentController,
  NavigationExtras,
  RouterService,
} from '@spryker-oryx/experience';
import { layoutStyles } from '@spryker-oryx/experience/composition';
import { resolve } from '@spryker-oryx/injector';
import { Facet, FacetValue, RangeFacetValue } from '@spryker-oryx/product';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { NullableGeneric } from '@spryker-oryx/utilities/typescript';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { combineLatest, map, startWith, Subject } from 'rxjs';
import { FacetListService } from '../../src/services/facet-list.service';
import { FacetsOptions } from './facet-navigation.model';
import { facetNavigation } from './facet-navigation.styles';

export class SearchFacetNavigationComponent extends ComponentMixin<FacetsOptions>() {
  static styles = [layoutStyles, facetNavigation];

  private defaultOptions: FacetsOptions = {
    valueRenderLimit: 5,
    expandedItemsCount: 5,
  };

  protected options$ = new ContentController(this)
    .getOptions()
    .pipe(map((options) => ({ ...this.defaultOptions, ...options })));
  protected facetListService = resolve(FacetListService);
  protected routerService = resolve(RouterService);
  protected renderedFacetElements = new Map<
    string,
    { renderedItemsCount: number; isShowAll: boolean }
  >();
  protected facetVisibilityChange = new Subject<{
    parameter: string;
    isShowAll: boolean;
  }>();

  protected facets$ = combineLatest([
    this.facetListService.get(),
    this.options$,
    this.facetVisibilityChange.pipe(startWith(null)),
    this.routerService.activatedRouter(),
  ]);

  protected renderFacets(
    facets: Facet[],
    options: FacetsOptions,
    facetVisibilityChange: { parameter: string; isShowAll: boolean } | null,
    activatedRouter: { route: string; extras?: NavigationExtras }
  ): TemplateResult<1> {
    return html`${facets.map((facet, index) => {
      this.renderedFacetElements.set(facet.parameter, {
        renderedItemsCount: 0,
        isShowAll:
          facet.parameter === facetVisibilityChange?.parameter
            ? facetVisibilityChange.isShowAll
            : false,
      });

      return html`
        <oryx-collapsible
          ?open=${index < options.expandedItemsCount!}
          .appearance="inline"
          .toggleAppearance="iconButton"
          .header=${facet.name}
        >
          ${when(
            Array.isArray(facet.values),
            () => html`
              ${this.renderFacetValues(
                facet.values as FacetValue[],
                facet.parameter,
                options.valueRenderLimit!,
                activatedRouter
              )}
              ${this.renderShowHideAllButtons(
                facet.parameter,
                this.getFacetValueLength(facet.values as FacetValue[])
              )}
            `,
            () => this.renderRangeValue(facet.values as RangeFacetValue)
          )}
        </oryx-collapsible>
      `;
    })}`;
  }

  protected renderFacetValues(
    facets: NullableGeneric<FacetValue[]>,
    parameter: string,
    valueRenderLimit: number,
    activatedRouter: { route: string; extras?: NavigationExtras }
  ): TemplateResult<1> {
    const renderedFacetElement = this.renderedFacetElements?.get(parameter);
    return html`
      <ul>
        ${facets?.map((f) => {
          if (
            this.checkValueRenderLimit(parameter, valueRenderLimit) &&
            !renderedFacetElement?.isShowAll
          ) {
            return;
          }

          this.renderedFacetElements.set(parameter, {
            renderedItemsCount:
              this.renderedFacetElements?.get(parameter)!.renderedItemsCount +
              1,
            isShowAll: renderedFacetElement?.isShowAll ?? false,
          });
          return html`<li>
              <oryx-link>
                <a
                  href="${this.routerService.getUrl(activatedRouter.route, {
                    ...activatedRouter.extras,
                    queryParams: {
                      ...(activatedRouter.extras?.queryParams ?? {}),
                      [parameter.toLowerCase()]: `${f.value ?? f.name}`,
                    },
                  })}"
                >
                  ${f.name ?? f.value} (${f.count})
                </a>
              </oryx-link>
            </li>
            ${when(
              f.children?.length,
              () =>
                html`<li>
                  ${this.renderFacetValues(
                    f.children!,
                    parameter,
                    valueRenderLimit,
                    activatedRouter
                  )}
                </li>`
            )}`;
        })}
      </ul>
    `;
  }

  protected renderRangeValue(rangeFacet: RangeFacetValue): TemplateResult {
    return html` ${rangeFacet.max} ${rangeFacet.max} `;
  }

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.facets$,
        ([facets, options, facetVisibilityChange, activatedRouter]) => {
          return this.renderFacets(
            facets ?? [],
            options,
            facetVisibilityChange,
            activatedRouter
          );
        }
      )}
    `;
  }

  protected getFacetValueLength(facetValues: FacetValue[]): number {
    let facetLength = facetValues.length;

    const calcFacetsLength = (facetList: FacetValue[]) => {
      facetList.forEach((f) => {
        if (f.children?.length) {
          facetLength += f.children?.length;

          calcFacetsLength(f.children);
        }
      });
    };

    calcFacetsLength(facetValues);

    return facetLength;
  }

  protected checkValueRenderLimit(parameter: string, limit: number): boolean {
    const renderedItemsCount =
      this.renderedFacetElements.get(parameter)!.renderedItemsCount;

    return renderedItemsCount >= limit;
  }

  protected renderShowHideAllButtons(
    parameter: string,
    allItems: number
  ): TemplateResult | undefined {
    const renderedParameter = this.renderedFacetElements.get(parameter);
    if (
      renderedParameter!.renderedItemsCount >= allItems &&
      !renderedParameter?.isShowAll
    ) {
      return;
    }

    return renderedParameter!.isShowAll
      ? html`<button
          @click=${() => this.provideFacetVisibilityChange(parameter, false)}
        >
          Hide all
        </button>`
      : html`<button
          @click=${() => this.provideFacetVisibilityChange(parameter, true)}
        >
          Show all (${allItems})
        </button>`;
  }

  protected provideFacetVisibilityChange(
    parameter: string,
    isShowAll: boolean
  ): void {
    this.facetVisibilityChange.next({ parameter, isShowAll });
  }
}
