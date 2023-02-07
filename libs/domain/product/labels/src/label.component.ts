import { ContentMixin } from '@spryker-oryx/experience';
import { ProductLabel, ProductMixin } from '@spryker-oryx/product';
import { LitElement, TemplateResult } from 'lit';
import { html } from 'lit/static-html.js';
import { ProductLabelsOptions } from './label.model';
import { labelStyles } from './label.styles';

export class ProductLabelsComponent extends ProductMixin(
  ContentMixin<ProductLabelsOptions>(LitElement)
) {
  static styles = [labelStyles];

  protected override render(): TemplateResult {
    return html`${this.filterLabels(this.product?.labels)?.map(
      (label) => html`<oryx-chip
        .appearance=${label.appearance}
        ?invert=${label.invert}
      >
        ${label.name}
      </oryx-chip>`
    )}`;
  }

  /**
   * Filters labels based on the included and excluded options. Included and excluded
   * labels are compared by (label) name.
   *
   * The labels and in/exclusions are case insensitive.
   */
  protected filterLabels(labels?: ProductLabel[]): ProductLabel[] {
    const options = this.componentOptions;
    if (!options || !labels) return labels ?? [];

    return labels?.filter(
      (label) =>
        (!options.included && !options.excluded) ||
        options.included?.toLowerCase().includes(label.name.toLowerCase()) ||
        (options.excluded &&
          !options.excluded.toLowerCase().includes(label.name.toLowerCase()))
    );
  }
}
