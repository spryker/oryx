import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { hydratable } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html } from 'lit/static-html.js';
import { ProductDescriptionOptions } from './description.model';
import { convertLineFeedsToHTML } from './utils';

@defaultOptions({ truncateAfter: 3, enableToggle: true })
@hydratable(['mouseover', 'window:resize'])
export class ProductDescriptionComponent extends ProductMixin(
  ContentMixin<ProductDescriptionOptions>(LitElement)
) {
  protected override render(): TemplateResult {
    const {
      truncateAfter = 0,
      enableToggle,
      expandInitially,
    } = this.componentOptions ?? {};

    return html`
      <oryx-text
        .style=${`--line-clamp: ${truncateAfter}`}
        .hideToggle=${!enableToggle}
        .defaultExpanded=${expandInitially}
      >
        ${unsafeHTML(this.convert(this.product?.description))}
      </oryx-text>
    `;
  }

  protected convert(text?: string): string {
    return convertLineFeedsToHTML(text ?? '');
  }
}
