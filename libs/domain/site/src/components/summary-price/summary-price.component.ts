import { resolve } from '@spryker-oryx/di';
import { ObserveController, computed, signal, signalAware, signalProperty } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { PricingService } from '../../services';
import { property } from 'lit/decorators.js';
import { DirectiveResult } from 'lit/async-directive';
import { ChildPrice, PricesBehavior, SiteSummaryPriceComponentAttributes } from './summary-price.model';
import { siteSummaryPriceStyles } from './summary-price.styles';
import { when } from 'lit/directives/when.js';
import { combineLatest, filter, map, of, switchMap } from 'rxjs';
import { CollapsibleAppearance } from '@spryker-oryx/ui/collapsible';

@signalAware()
export class SiteSummaryPriceComponent extends LitElement 
  implements SiteSummaryPriceComponentAttributes {
  static styles = siteSummaryPriceStyles;
  protected pricingService = resolve(PricingService);
  protected observe = new ObserveController<
    LitElement & SiteSummaryPriceComponentAttributes
  >(this);

  @property() label?: string | DirectiveResult;
  @property() subtext?: string;
  @property() prices?: ChildPrice[];
  @property() pricesBehavior = PricesBehavior.Inline;
  @signalProperty() value?: number;
  @signalProperty() currency?: string;

  protected $price = computed(() =>
    this.pricingService.format(this.value, this.currency)
  );

  protected $prices = signal(
    this.observe.get('prices').pipe(
      switchMap(prices =>
        prices ? combineLatest(
          prices.map(({label, value, currency}) => this.pricingService.format(value, currency)
            .pipe(
              map((formattedValue) => ({ label, formattedValue })),
              filter(({formattedValue}) => formattedValue !== null),
            )
        )) : of(null)
      ),

    )
  );

  protected override render(): TemplateResult | void {
    if (!this.$price()) return;

    if (this.pricesBehavior !== PricesBehavior.Inline) {
      return this.renderCollapsible();
    }

    return html`
      ${this.renderPrice()}
      ${this.renderPrices()}
      ${when(this.subtext, () => html`<span class="subtext">${this.subtext}</span>`)}
    `;
  }

  protected renderPrice(): TemplateResult {
    return html`<span>${this.label}</span><span>${this.$price()}</span>`
  }

  protected renderPrices(): TemplateResult | void {
    const prices = this.$prices();
    if (!prices?.length) return;
    return html`<ul>
     ${prices.map(
        ({ label, formattedValue }) =>
          html`<li>
            <span>${label}</span>
            <span>${formattedValue}</span>
          </li>`
      )}
    </ul>`;
  }

  protected renderCollapsible(): TemplateResult {
    return html`<oryx-collapsible
      appearance="${CollapsibleAppearance.Inline}"
      ?open=${this.pricesBehavior !== PricesBehavior.Collapsed}
    >
      <span slot="heading">
        ${this.label}
      </span>
      <span slot="aside">${this.value}</span>
      ${this.renderPrices()}
    </oryx-collapsible>`;
  }
}
