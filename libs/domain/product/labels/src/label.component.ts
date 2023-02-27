import { ContentMixin } from '@spryker-oryx/experience';
import { ProductLabel, ProductMixin } from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { html } from 'lit/static-html.js';
import { ProductLabelsOptions } from './label.model';
import { labelStyles } from './label.styles';

hydratable(['mouseover', 'focusin']);
export class ProductLabelsComponent extends ProductMixin(
  ContentMixin<ProductLabelsOptions>(LitElement)
) {
  static styles = [labelStyles];

  protected override render(): TemplateResult {
    const labels = this.filterLabels();

    return html`${when(labels, () =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      labels!.map(
        (label) => html`<oryx-chip
          .appearance=${label.appearance}
          ?invert=${!!this.componentOptions?.invert}
        >
          ${label.name}
        </oryx-chip>`
      )
    )}`;
  }

  /**
   * Filters labels based on the included and excluded options. Included and excluded
   * labels are compared by (label) name.
   *
   * The labels and in/exclusions are case insensitive.
   */
  protected filterLabels(): ProductLabel[] | undefined {
    const options = this.componentOptions;
    const labels = this.product?.labels;

    if (!options || !labels) return labels;

    return labels?.filter(
      (label) =>
        (!options.included && !options.excluded) ||
        options.included?.toLowerCase().includes(label.name.toLowerCase()) ||
        (options.excluded &&
          !options.excluded.toLowerCase().includes(label.name.toLowerCase()))
    );
  }
}
