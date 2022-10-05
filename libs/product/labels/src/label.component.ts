import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
  ProductLabel,
} from '@spryker-oryx/product';
import { TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { combineLatest, map } from 'rxjs';
import { ProductLabelsAttributes } from './label.model';
import { labelStyles } from './label.styles';

export class ProductLabelsComponent extends ProductComponentMixin<ProductLabelsAttributes>() {
  static styles = [labelStyles];

  protected options$ = new ContentController(this).getOptions();
  protected product$ = new ProductController(this).getProduct();

  protected labels$ = combineLatest([this.options$, this.product$]).pipe(
    map(([options, product]) => this.filterLabels(options, product?.labels))
  );

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.labels$,
        (labels) =>
          html`${labels?.map(
            (label) => html`<oryx-chip .appearance=${label.appearance}>
              ${label.name}
            </oryx-chip>`
          )}`
      )}
    `;
  }

  /**
   * Filters labels based on the included and excluded options. Included and excluded
   * labels are compared to the label name.
   *
   * The labels and in/exclusions are case insensitive.
   */
  protected filterLabels(
    options: ProductLabelsAttributes,
    labels: ProductLabel[] = []
  ): ProductLabel[] {
    return labels?.filter(
      (label) =>
        (!options.included && !options.excluded) ||
        options.included?.toLowerCase().includes(label.name.toLowerCase()) ||
        (options.excluded &&
          !options.excluded.toLowerCase().includes(label.name.toLowerCase()))
    );
  }
}
