import { resolve } from '@spryker-oryx/di';
import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';
import { ProductCategoryService, ProductMixin } from '@spryker-oryx/product';
import { computed, hydrate, signal } from '@spryker-oryx/utilities';
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

  protected $tree = signal(this.productCategoryService.getTree());

  protected $categories = computed(() => {
    if (this.categoryId) {
      return this.$tree()?.filter((c) => c.parent === this.categoryId);
    } else {
      return this.$tree()?.filter((c) => !c.parent);
    }
  });

  protected override render(): TemplateResult {
    return html`
      ${repeat(
        this.$categories() ?? [],
        (c) => c.id,
        (c) => this.renderTree(c.id)
      )}
      ${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}
    `;
  }

  protected renderTree(categoryId: string): TemplateResult {
    const hasChildren = this.hasChildren(categoryId);
    const iconSuffix =
      this.dropdown && hasChildren ? 'navigate_next' : undefined;
    const link = html` <oryx-content-link
      .options=${{
        id: categoryId,
        type: 'category',
        iconSuffix: iconSuffix,
      }}
    ></oryx-content-link>`;

    if (hasChildren) {
      return html`<div>
        ${link}
        <oryx-product-category-list
          .categoryId=${categoryId}
          ?layout-dropdown=${this.dropdown}
          nested
        ></oryx-product-category-list>
      </div>`;
    } else {
      return link;
    }
  }

  protected hasChildren(categoryId: string): boolean {
    return !!this.$tree().find((c) => c.parent === categoryId);
  }
}
