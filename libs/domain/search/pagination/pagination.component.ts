import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  ProductListPageService,
  ProductListQualifier,
} from '@spryker-oryx/product';
import { hydrate, signal } from '@spryker-oryx/utilities';
import { LitElement, html } from 'lit';
import { TemplateResult } from 'lit/development';
import urlJoin from 'url-join';
import { SearchPaginationOptions } from './pagination.model';

@defaultOptions({ max: 3, enableControls: true })
@hydrate({ event: 'window:load' })
export class SearchPaginationComponent extends ContentMixin<
  SearchPaginationOptions & ProductListQualifier
>(LitElement) {
  protected productListPageService = resolve(ProductListPageService);

  protected pagination = signal(this.productListPageService.getPagination());

  protected override render(): TemplateResult {
    const { max, enableControls } = this.$options();
    const { currentPage, maxPage } = this.pagination() ?? {};

    return html`
      <oryx-pagination
        .max=${max}
        .current=${currentPage}
        ?enableNavigation=${enableControls}
      >
        ${[...Array(maxPage || 1).keys()].map(
          (i) => html`<a href=${this.generateLink(i + 1)}>${i + 1}</a>`
        )}
      </oryx-pagination>
    `;
  }

  protected generateLink(page: number): string {
    const urlParams = new URLSearchParams(globalThis.location.search);
    urlParams.set('page', page.toString());
    const stringifiedParams = urlParams.toString();

    return urlJoin(
      globalThis.location.origin,
      globalThis.location.pathname,
      stringifiedParams ? `?${stringifiedParams}` : ''
    );
  }
}
