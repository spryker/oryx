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
import { DayComponentAttributes } from './day.model';

@hydrate()
@signalAware()
export class SiteDayComponent extends ContentMixin<DayComponentAttributes>(
  LitElement
) {
  protected localeService = resolve(LocaleService);

  @signalProperty() day?: string;
  @signalProperty() i18nToken?: string;

  protected $day = computed(() =>
    this.day ? this.localeService.formatDay(this.day) : undefined
  );

  protected override render(): TemplateResult | void {
    if (!this.$day()) return;
    if (this.i18nToken) {
      return html`${this.i18n(this.i18nToken, { day: this.$day() })}`;
    } else {
      return html`${this.$day()}`;
    }
  }
}
