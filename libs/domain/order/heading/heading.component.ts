import { ContentMixin } from '@spryker-oryx/experience';
import { OrderMixin } from '@spryker-oryx/order';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { LitElement, TemplateResult, html } from 'lit';
import { styles } from './heading.styles';

export class OrderHeadingComponent extends OrderMixin(
  ContentMixin(LitElement)
) {
  static styles = styles;

  protected override render(): TemplateResult | void {
    if (!this.$order()) return;

    return html`<oryx-heading .as=${HeadingTag.H6}>
      <h3>
        ${this.i18n('order.<count>-items', {
          count: this.$order().items.length,
        })}
      </h3>
    </oryx-heading>`;
  }
}
