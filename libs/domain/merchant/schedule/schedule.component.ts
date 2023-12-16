import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { MerchantMixin, MerchantScheduleSlot } from '@spryker-oryx/merchant';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { MerchantScheduleComponentOptions } from './schedule.model';
import { merchantScheduleStyles } from './schedule.styles';

@defaultOptions({ tag: HeadingTag.H3 })
export class MerchantScheduleComponent extends MerchantMixin(
  ContentMixin<MerchantScheduleComponentOptions>(LitElement)
) {
  static styles = merchantScheduleStyles;

  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();
    if (!merchant?.schedule) return;

    return html`
      ${[
        this.renderSlots(this.getOpeningHours(), 'opening-hours'),
        this.renderSlots(this.getOpenDates(), 'open-dates'),
        this.renderSlots(this.getClosedDates(), 'closed-dates'),
      ]}
    `;
  }

  /**
   * Get opening hours from the merchant schedule, collecting all slots
   * without date from the opened and closed schedule.
   */
  protected getOpeningHours(): MerchantScheduleSlot[] | undefined {
    if (this.$options().type && this.$options().type !== 'open-dates') return;
    return [
      ...(this.$merchant()?.schedule.opened?.filter((slot) => !slot.date) ??
        []),
      ...(this.$merchant()?.schedule.closed?.filter((slot) => !slot.date) ??
        []),
    ];
  }

  /**
   * Get open dates from the merchant opened schedule, which are all slots with a date.
   */
  protected getOpenDates(): MerchantScheduleSlot[] | undefined {
    if (this.$options().type && this.$options().type !== 'open-dates') return;
    return this.$merchant()?.schedule.opened?.filter((slot) => !!slot.date);
  }

  /**
   * Get open dates from the merchant closed schedule, which are all slots with a date.
   */
  protected getClosedDates(): MerchantScheduleSlot[] | undefined {
    if (this.$options().type && this.$options().type !== 'closed-dates') return;
    return this.$merchant()?.schedule.closed?.filter((slot) => !!slot.date);
  }

  protected renderSlots(
    days: MerchantScheduleSlot[] | undefined,
    type: 'opening-hours' | 'open-dates' | 'closed-dates'
  ): TemplateResult | void {
    if (!days?.length) return;
    return html`
      <oryx-heading .tag=${this.$options().tag}>
        ${this.i18n(`merchant.schedule.${type}`)}
      </oryx-heading>
      <ul>
        ${repeat(
          days,
          (weekday) =>
            html`<li>
              ${when(
                weekday.date,
                () => html`<oryx-date .stamp=${weekday.date}></oryx-date>`,
                () => html`<oryx-site-day .day=${weekday.day}></oryx-site-day>`
              )}
              ${when(type === 'opening-hours', () =>
                this.renderTimeSlots(weekday)
              )}
            </li>`
        )}
      </ul>
    `;
  }

  protected renderTimeSlots(slot: MerchantScheduleSlot): TemplateResult | void {
    if (!slot.times?.length)
      return html`<div>${this.i18n('merchant.closed')}</div>`;

    return html` ${repeat(
      slot.times,
      (time) => html` <div>
        <oryx-site-time .stamp=${this.getDate(time.from)}></oryx-site-time>
        -
        <oryx-site-time .stamp=${this.getDate(time.to)}></oryx-site-time>
      </div>`
    )}`;
  }

  protected getDate(time?: string): Date | undefined {
    if (!time) return;
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }
}
