import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Loading, ProductMediaComponentOptions } from './media.model';
import { styles } from './media.styles';

@hydratable('mouseover')
export class ProductMediaComponent extends ProductComponentMixin<ProductMediaComponentOptions>() {
  static styles = styles;

  protected product$ = new ProductController(this).getProduct();
  protected options$ = new ContentController(this).getOptions();

  protected invalidResources$ = new BehaviorSubject<string[]>([]);

  protected getValidResource(
    resources: (string | undefined | null)[],
    invalidResources: string[]
  ): string | undefined | null {
    return resources.find(
      (resource) => !!resource && !invalidResources.includes(resource)
    );
  }

  protected productMedia$: Observable<ProductMediaComponentOptions> =
    combineLatest([this.options$, this.product$, this.invalidResources$]).pipe(
      map(([options, product, invalidResources]) => {
        const { externalUrlSmall, externalUrlLarge } =
          product?.images?.[0] ?? {};

        let src = 'src' in options ? options.src : externalUrlSmall;
        let hdSrc = 'hdSrc' in options ? options.hdSrc : externalUrlLarge;

        if (invalidResources.length || !src) {
          src = this.getValidResource([src, hdSrc], invalidResources);
          hdSrc = undefined;
        }

        const alt = product?.name;

        return {
          alt,
          loading: Loading.Lazy,
          breakpoint: 768,
          ...options,
          src,
          hdSrc,
        };
      })
    );

  protected onError(e: Event, options: ProductMediaComponentOptions): void {
    const { src, hdSrc, breakpoint } = options;

    //define which resource is invalid
    const invalidResource =
      hdSrc && breakpoint && window.innerWidth >= breakpoint ? hdSrc : src;

    this.invalidResources$.next([
      ...this.invalidResources$.getValue(),
      invalidResource as string,
    ]);
  }

  protected override render(): TemplateResult {
    return html` ${asyncValue(
      this.productMedia$,
      (options: ProductMediaComponentOptions): TemplateResult => {
        const { src, hdSrc, alt, loading, breakpoint } = options;

        if (!src) {
          return html`<oryx-icon type="image" part="fallback"></oryx-icon>`;
        }

        return html`
          <picture>
            ${when(
              !!hdSrc,
              () =>
                html`<source
                  media="(min-width: ${breakpoint}px)"
                  srcset=${hdSrc}
                />`
            )}
            <img
              src=${src}
              alt=${ifDefined(alt)}
              loading=${ifDefined(loading)}
              @error=${(e: Event): void => this.onError(e, options)}
            />
          </picture>
        `;
      }
    )}`;
  }
}
