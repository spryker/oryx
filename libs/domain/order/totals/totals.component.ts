import { ContentMixin } from '@spryker-oryx/experience';
import { hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { OrderMixin } from '../src/mixins';
import { orderTotalStyles } from './totals.styles';

@hydratable('window:load')
export class OrderTotalsComponent extends OrderMixin(ContentMixin(LitElement)) {
  static styles = orderTotalStyles;

  protected override render(): TemplateResult | void {
    if (!this.$order()) return;

    return html`<h2>${i18n('order.totals.summary')}</h2>
      <oryx-composition .uid=${this.uid}></oryx-composition>`;
  }
}
