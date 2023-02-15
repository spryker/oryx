import { resolve } from '@spryker-oryx/di';
import {
  ComponentMixin,
  ContentController,
  defaultOptions,
} from '@spryker-oryx/experience';
import {
  ProductListPageService,
  ProductListQualifier,
} from '@spryker-oryx/product';
import { asyncValue } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { TemplateResult } from 'lit/development';
import { ifDefined } from 'lit/directives/if-defined.js';
import { combineLatest } from 'rxjs';
import { PaginationOptions } from './pagination.model';

@defaultOptions({ max: 3, enableControls: true })
export class PaginationComponent extends ComponentMixin<
  PaginationOptions & ProductListQualifier
>() {
  protected options$ = new ContentController(this).getOptions();

  protected productListPageService = resolve(ProductListPageService);

  protected data$ = combineLatest([
    this.options$,
    this.productListPageService.getPagination(),
  ]);

  protected override render(): TemplateResult {
    return html` ${asyncValue(
      this.data$,
      ([options, pagination]) =>
        html`
          <oryx-pagination
            max=${ifDefined(options.max)}
            current=${ifDefined(pagination?.currentPage)}
            ?hideNavigation=${!options.enableControls}
          >
            ${[...Array(pagination?.maxPage || 1).keys()].map((i) =>
              this.renderAnchor(i + 1)
            )}
          </oryx-pagination>
        `
    )}`;
  }

  protected renderAnchor(page: number): TemplateResult {
    return html` <a href=${this.generateLink(page)}>${page}</a>`;
  }

  protected generateLink(page: number): string {
    const urlParams = new URLSearchParams(globalThis.location.search);
    urlParams.set('page', page.toString());

    return `${globalThis.location.origin}${globalThis.location.pathname}${
      urlParams.toString() ? `?${urlParams.toString()}` : ''
    }`;
  }
}
