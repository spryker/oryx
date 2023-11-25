import { resolve } from '@spryker-oryx/di';
import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';
import { ProductCategoryService, ProductMixin } from '@spryker-oryx/product';
import {
  computed,
  hydrate,
  signal,
  signalProperty,
} from '@spryker-oryx/utilities';
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

  @signalProperty() categoryId?: string;
  @property({ type: 'boolean' }) dropdown?: boolean;

  protected productCategoryService = resolve(ProductCategoryService);

  protected $all = signal(this.productCategoryService.getTree());

  protected $list = computed(() => {
    const { id, nested } = this.$options();
    if (!(id || this.categoryId) || !nested) {
      return this.productCategoryService.getList();
    } else {
      return this.productCategoryService.getList({
        parent: id || this.categoryId,
      });
    }
  });

  protected $filteredList = computed(() => {
    const items = this.$list() ?? [];
    const excludes = this.getExcludes(items.map((c) => c.id));
    return items.filter((c) => !excludes.includes(c.id));
  });

  protected override render(): TemplateResult {
    return html`
      <section>
        ${repeat(
          this.$filteredList(),
          (c) => c.id,
          (c) => this.renderItem(c.id)
        )}
      </section>
      <section>
        <oryx-content-link
          .options=${{
            id: 5,
            type: 'category',
            singleLine: true,
          }}
        ></oryx-content-link>
      </section>
      ${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}
    `;
  }

  protected renderItem(id: string): TemplateResult {
    const hasChildren = this.hasChildren(id);
    const iconSuffix =
      this.dropdown && hasChildren ? 'navigate_next' : undefined;

    const link = html`<oryx-content-link
      .options=${{
        id,
        type: 'category',
        iconSuffix: iconSuffix,
        singleLine: true,
      }}
    ></oryx-content-link>`;

    const { nested } = this.$options();
    if (nested && hasChildren) {
      return html`<div>
        ${link}
        <oryx-product-category-list
          .options=${{ id, nested }}
        ></oryx-product-category-list>
      </div>`;
    } else {
      return link;
    }
  }

  protected hasChildren(categoryId: string): boolean {
    return !!this.$all()?.find((c) => c.parent === categoryId);
  }

  protected getExcludes(categories: string[]): string[] {
    const { exclude } = this.$options();
    let excludedIds: string[] = [];

    if (exclude) {
      // Convert both string and array notations to array of strings
      const excludeIds = Array.isArray(exclude)
        ? exclude.map(String)
        : exclude.split(',').map((id) => id.trim());

      // Handle range notations like >5, <4, 4..11
      excludedIds = categories.filter((categoryId) => {
        return excludeIds.some((excludedId) => {
          if (excludedId.includes('..')) {
            const [start, end] = excludedId
              .split('..')
              .map((num) => parseInt(num, 10));
            const num = parseInt(categoryId, 10);
            return num >= start && num <= end;
          } else if (excludedId.startsWith('>')) {
            const threshold = parseInt(excludedId.slice(1), 10);
            return parseInt(categoryId, 10) > threshold;
          } else if (excludedId.startsWith('<')) {
            const threshold = parseInt(excludedId.slice(1), 10);
            return parseInt(categoryId, 10) < threshold;
          } else {
            // Regular ID match
            return categoryId === excludedId;
          }
        });
      });
    }

    return excludedIds;
  }
}
