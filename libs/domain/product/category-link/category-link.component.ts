import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { ProductCategoryService } from '@spryker-oryx/product';
import { RouteType } from '@spryker-oryx/router';
import {
  computed,
  hydrate,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { of } from 'rxjs';
import { ProductCategoryLinkOptions } from './category-link.model';

@signalAware()
@hydrate({ event: ['mouseover', 'focusin'] })
export class ProductCategoryLinkComponent extends ContentMixin<ProductCategoryLinkOptions>(
  LitElement
) {
  @signalProperty() category?: string;

  protected categoryService = resolve(ProductCategoryService);

  protected $category = computed(() => {
    const category = this.category ?? this.$options()?.category;

    if (!category) {
      return of(null);
    }

    return this.categoryService.get(category);
  });

  protected override render(): TemplateResult | void {
    const category = this.$category();

    if (!category) {
      return;
    }

    return html`<oryx-content-link
      .options=${{
        type: RouteType.Category,
        id: category.id,
      }}
      .content=${{ text: category.name }}
    ></oryx-content-link>`;
  }
}
