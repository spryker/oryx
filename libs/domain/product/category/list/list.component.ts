import { resolve } from '@spryker-oryx/di';
import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';
import { ProductCategoryService, ProductMixin } from '@spryker-oryx/product';
import { computed, hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  ProductCategoryListAttributes,
  ProductCategoryListOptions,
} from './list.model';
import { categoryListStyles } from './list.styles';

@hydrate()
export class ProductCategoryListComponent
  extends ProductMixin(
    LayoutMixin(ContentMixin<ProductCategoryListOptions>(LitElement))
  )
  implements ProductCategoryListAttributes
{
  static styles = categoryListStyles;

  @property() categoryId?: string;

  protected productCategoryService = resolve(ProductCategoryService);

  protected $list = computed(() => {
    const { id, exclude } = this.$options();
    return this.productCategoryService.getList({
      parent: id || this.categoryId,
      exclude,
    });
  });

  protected override render(): TemplateResult {
    return html`
      ${repeat(
        this.$list() ?? [],
        (category) => category.id,
        (category) => this.renderItem(category.id)
      )}
      ${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}
    `;
  }

  protected renderItem(id: string): TemplateResult {
    return html`<oryx-content-link
      .options=${{ id, type: 'category' }}
    ></oryx-content-link>`;
  }
}
