import { ContentMixin } from '@spryker-oryx/experience';
import { OrderMixin } from '@spryker-oryx/order';
import { LitElement, TemplateResult, html } from 'lit';

export class OrderHeadingComponent extends OrderMixin(
  ContentMixin(LitElement)
) {
  protected override render(): TemplateResult | void {
    if (!this.$order()) return;

    return html`<oryx-heading tag="h3" as="h6">
      ${this.i18n('order.<count>-items', {
        count: this.$order().items.length,
      })}
    </oryx-heading>`;
  }
}
