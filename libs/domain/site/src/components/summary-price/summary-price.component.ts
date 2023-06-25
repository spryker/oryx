import { resolve } from '@spryker-oryx/di';
import { CollapsibleAppearance } from '@spryker-oryx/ui/collapsible';
import {
  computed,
  ObserveController,
  signal,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { DirectiveResult } from 'lit/async-directive';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { combineLatest, filter, map, of, switchMap } from 'rxjs';
import { PricesBehavior, TotalPrice } from '../../models';
import { PricingService } from '../../services';
import { SiteSummaryPriceComponentAttributes } from './summary-price.model';
import { siteSummaryPriceStyles } from './summary-price.styles';

@signalAware()
export class SiteSummaryPriceComponent
  extends LitElement
  implements SiteSummaryPriceComponentAttributes
{
  static styles = siteSummaryPriceStyles;

  protected pricingService = resolve(PricingService);
  protected observe = new ObserveController<
    LitElement & SiteSummaryPriceComponentAttributes
  >(this);

  @property() label?: string | DirectiveResult;
  @property({ reflect: true }) subtext?: string | DirectiveResult;
  @property() prices?: TotalPrice[];
  @property() pricesBehavior = PricesBehavior.Inline;
  @property({ type: Boolean, reflect: true }) delimiter?: boolean;
  @property({ type: Boolean, reflect: true }) accented?: boolean;
  @signalProperty() value?: number | string;
  @signalProperty() currency?: string;

  protected $price = computed(() => {
    //probably temporary solution until delivery has hardcoded string value
    if (isNaN(Number(this.value))) {
      return of(this.value);
    }
    return this.pricingService.format(this.value, this.currency);
  });

  protected $prices = signal(
    this.observe.get('prices').pipe(
      switchMap((prices) =>
        prices
          ? combineLatest(
              prices.map(({ label, value, currency }) =>
                this.pricingService.format(value, currency).pipe(
                  map((formattedValue) => ({ label, formattedValue })),
                  filter(({ formattedValue }) => formattedValue !== null)
                )
              )
            )
          : of(null)
      )
    )
  );

  protected override render(): TemplateResult | void {
    if (!this.$price()) return;

    if (!!this.$prices() && this.pricesBehavior !== PricesBehavior.Inline) {
      return this.renderCollapsible();
    }

    return html`
      ${this.renderPrice()} ${this.renderPrices()}
      ${when(
        this.subtext,
        () => html`<span class="subtext">${this.subtext}</span>`
      )}
    `;
  }

  protected renderPrice(): TemplateResult {
    return html`<span>${this.label}</span><span>${this.$price()}</span>`;
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
      <span slot="heading"> ${this.label} </span>
      <span slot="aside">${this.$price()}</span>
      ${this.renderPrices()}
    </oryx-collapsible>`;
  }
}
