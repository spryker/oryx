import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import {
  MerchantDateSlot,
  MerchantMixin,
  MerchantWeekdaySlot,
} from '@spryker-oryx/merchant';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { computed } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { MerchantScheduleComponentOptions } from './schedule.model';
import { merchantScheduleStyles } from './schedule.styles';
import { getWeek } from './util';

@defaultOptions({
  tag: HeadingTag.H3,
  weeksBefore: 1,
  weeksAfter: 12,
})
export class MerchantScheduleComponent extends MerchantMixin(
  ContentMixin<MerchantScheduleComponentOptions>(LitElement)
) {
  static styles = merchantScheduleStyles;

  protected $dates = computed(() => {
    const { weeksBefore, weeksAfter } = this.$options();
    if (weeksBefore === undefined && weeksAfter === undefined)
      return this.$merchant()?.schedule.dates;
    const start = getWeek(-(weeksBefore ?? 0)).start;
    const end =
      weeksAfter && weeksAfter >= 0 ? getWeek(weeksAfter).end : getWeek().end;

    return this.$merchant()?.schedule.dates?.filter((slot) => {
      const matchStart = new Date(slot.date).getTime() >= start.getTime();
      const matchEnd = new Date(slot.date).getTime() <= end.getTime();

      return matchStart && matchEnd;
    });
  });

  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();

    if (!merchant?.schedule) return;

    return html`${[this.renderWeekdays(), this.renderDates()]}`;
  }

  protected renderWeekdays(): TemplateResult | void {
    const weekdays = this.$merchant()?.schedule.weekdays;

    if (!weekdays?.length) return;

    return html`<oryx-heading .tag=${this.$options().tag}>
        ${this.i18n(`merchant.schedule.weekdays`)}
      </oryx-heading>

      <ul>
        ${repeat(weekdays, (weekday) => html`${this.renderDay(weekday)}`)}
      </ul>`;
  }

  protected renderDay(
    weekday: MerchantWeekdaySlot | MerchantDateSlot
  ): TemplateResult {
    return html`<li ?deviated=${!!(weekday as MerchantDateSlot).date}>
      ${when(
        'day' in weekday,
        () =>
          html`<oryx-site-day
            .day=${(weekday as MerchantWeekdaySlot).day}
          ></oryx-site-day>`,
        () => html`<oryx-date
          .stamp=${(weekday as MerchantDateSlot).date}
          .i18nToken=${'merchant.schedule.<date>'}
        ></oryx-date>`
      )}
      ${this.renderTimeSlots(weekday)}
    </li>`;
  }

  protected renderDates(): TemplateResult | void {
    const dates = this.$dates();
    if (!dates?.length) return;

    return html`<oryx-heading .tag=${this.$options().tag}>
        ${this.i18n(`merchant.schedule.dates`)}
      </oryx-heading>
      <ul>
        ${repeat(
          dates,
          (date) => html`<li>
            <span>
              <oryx-date
                .stamp=${date.date}
                .i18nToken=${'merchant.schedule.<date>'}
              ></oryx-date>
              ${when(
                date.note,
                () =>
                  html`${this.i18n('merchant.schedule.<note>', {
                    note: date.note,
                  })}`
              )}
            </span>
            ${this.renderTimeSlots(date)}
          </li>`
        )}
      </ul> `;
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
