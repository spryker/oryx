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

  protected $item = computed(() => {
    const { exclude } = this.$options();
    return this.productCategoryService.get({ id: this.categoryId, exclude });
  });

  // TODO: pass excludes as a qualifier whenever supported
  protected $tree = signal(this.productCategoryService.getTree());

  protected $categories = computed(() => {
    if (this.categoryId) {
      const item = this.$item();
      if (item) return [item];
    } else {
      const items = this.$tree()?.filter((c) => !c.parent);
      if (items) {
        const excludes = this.getExcludes(items.map((c) => c.id));
        return items.filter((c) => !excludes.includes(c.id));
      }
    }
    return [];
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

  protected renderTree(categoryId: string): TemplateResult {
    const hasChildren = this.hasChildren(categoryId);
    const iconSuffix =
      this.dropdown && hasChildren ? 'navigate_next' : undefined;

    const link = html`<oryx-content-link
      .options=${{
        id: categoryId,
        type: 'category',
        iconSuffix: iconSuffix,
      }}
    ></oryx-content-link>`;

    const { nested } = this.$options();
    if (nested && hasChildren) {
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
