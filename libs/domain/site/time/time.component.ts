import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LocaleService } from '@spryker-oryx/i18n';
import {
  computed,
  hydrate,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { SiteTimeComponentAttributes } from './time.model';

@hydrate()
@signalAware()
export class SiteTimeComponent
  extends ContentMixin(LitElement)
  implements SiteTimeComponentAttributes
{
  protected localeService = resolve(LocaleService);

  @signalProperty() stamp?: string | number | Date;
  @signalProperty() i18nToken?: string;

  protected $time = computed(() =>
    this.stamp ? this.localeService.formatTime(this.stamp) : undefined
  );

  protected override render(): TemplateResult | void {
    if (!this.$time()) return;
    if (this.i18nToken) {
      return html`${this.i18n(this.i18nToken, { time: this.$time() })}`;
    } else {
      return html`${this.$time()}`;
    }
  }
}
