import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  MerchantDateSlot,
  MerchantMixin,
  MerchantWeekdaySlot,
} from '@spryker-oryx/merchant';
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

    return html` ${[this.renderWeekdays(), this.renderDates()]} `;
  }

  protected renderWeekdays(): TemplateResult | void {
    if (this.$options().type && this.$options().type !== 'weekdays') return;
    const weekdays = this.$merchant()?.schedule.weekdays;

    if (!weekdays?.length) return;

    return html`<oryx-heading .tag=${this.$options().tag}>
        ${this.i18n(`merchant.schedule.weekdays`)}
      </oryx-heading>
      <ul>
        ${repeat(
          weekdays,
          (weekday) =>
            html`<li>
              <oryx-site-day .day=${weekday.day}></oryx-site-day>
              ${this.renderTimeSlots(weekday)}
            </li>`
        )}
      </ul>`;
  }

  protected renderDates(): TemplateResult | void {
    if (this.$options().type && this.$options().type !== 'dates') return;
    const dates = this.getDates();
    if (!dates?.length) return;

    return html`<oryx-heading .tag=${this.$options().tag}>
        ${this.i18n(`merchant.schedule.dates`)}
      </oryx-heading>
      <ul>
        ${repeat(
          dates,
          (date) =>
            html`<li>
              ${when(
                date.note,
                () => html` <oryx-date
                  .stamp=${date.date}
                  .i18nToken=${'merchant.schedule.<date>-<note>'}
                  .i18nContext=${{ note: date.note }}
                ></oryx-date>`,
                () => html` <oryx-date
                  .stamp=${date.date}
                  .i18nToken=${'merchant.schedule.<date>'}
                ></oryx-date>`
              )}
              ${this.renderTimeSlots(date)}
            </li>`
        )}
      </ul>`;
  }
  protected getDates(): MerchantDateSlot[] | undefined {
    const { filterBefore, filterAfter } = this.$options();

    if (!filterBefore && !filterAfter) return this.$merchant()?.schedule.dates;

    const compareBefore = new Date();
    const compareAfter = new Date();
    if (filterBefore) {
      switch (filterBefore) {
        case 'week':
          compareBefore.setDate(compareBefore.getDate() - 7);
          break;
        case 'month':
          compareBefore.setMonth(compareBefore.getMonth() - 1);
          break;
        case 'quarter':
          compareBefore.setMonth(compareBefore.getMonth() - 3);
          break;
        case 'year':
          compareBefore.setFullYear(compareBefore.getFullYear() - 1);
          break;
      }
    }

    if (filterAfter) {
      switch (filterAfter) {
        case 'week':
          compareAfter.setDate(compareAfter.getDate() + 7);
          break;
        case 'month':
          compareAfter.setMonth(compareAfter.getMonth() + 1);
          break;
        case 'quarter':
          compareAfter.setMonth(compareAfter.getMonth() + 3);
          break;
        case 'year':
          compareAfter.setFullYear(compareAfter.getFullYear() + 1);
          break;
      }
    }

    return this.$merchant()?.schedule.dates?.filter((slot) => {
      const matchBefore =
        !filterBefore ||
        new Date(slot.date).getTime() >= compareBefore.getTime();
      const matchAfter =
        !filterAfter || new Date(slot.date).getTime() <= compareAfter.getTime();

      return matchBefore && matchAfter;
    });
  }

  protected renderTimeSlots(
    slot: MerchantWeekdaySlot | MerchantDateSlot
  ): TemplateResult | void {
    if (!slot.times?.length)
      return html`<div>${this.i18n('merchant.schedule.closed')}</div>`;

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
