import { resolve } from '@spryker-oryx/di';
import {
  ContentController,
  ContentMixin,
  defaultOptions,
} from '@spryker-oryx/experience';
import {
  ProductListPageService,
  ProductListQualifier,
} from '@spryker-oryx/product';
import { hydratable, signal } from '@spryker-oryx/utilities';
import { html, LitElement } from 'lit';
import { TemplateResult } from 'lit/development';
import { ifDefined } from 'lit/directives/if-defined.js';
import urlJoin from 'url-join';
import { PaginationOptions } from './pagination.model';

@defaultOptions({ max: 3, enableControls: true })
@hydratable('window:load')
export class PaginationComponent extends ContentMixin<
  PaginationOptions & ProductListQualifier
>(LitElement) {
  protected options$ = new ContentController(this).getOptions();

  protected productListPageService = resolve(ProductListPageService);

  protected $pagination = signal(
    resolve(ProductListPageService).getPagination()
  );

  protected override render(): TemplateResult {
    const { max, enableControls } = this.$options();
    const { currentPage, maxPage } = this.$pagination() ?? {};

    return html`
      <oryx-pagination
        max=${ifDefined(max)}
        current=${ifDefined(currentPage)}
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
