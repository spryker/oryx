import { ContentMixin } from '@spryker-oryx/experience';
import {
  MerchantMixin,
  MerchantScheduleSlot,
  TimeRange,
} from '@spryker-oryx/merchant';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { openingHoursStyles } from './opening-hours.styles';

export class MerchantOpeningsHoursComponent extends MerchantMixin(
  ContentMixin(LitElement)
) {
  static styles = openingHoursStyles;

  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();

    if (!merchant) return;

    return html`
      <h3>${this.i18n('merchant.openings-hours')}</h3>

      <ul>
        ${repeat(
          merchant.schedule.opened ?? [],
          (weekday) =>
            html`<li>
              ${this.i18n(`merchant.weekdays.${weekday.day}`)}
              ${this.renderSlots(weekday)}
            </li>`
        )}
      </ul>
    `;
  }

  protected renderSlots(slot: MerchantScheduleSlot): TemplateResult | void {
    if (slot.day) {
      if (!slot.times?.length)
        return html`<div>${this.i18n('merchant.closed')}</div>`;

      return html` ${repeat(slot.times, (time) =>
        this.renderTimeSlot(slot.day!, time)
      )}`;
    }
  }

  protected renderTimeSlot(
    day: string,
    time: TimeRange
  ): TemplateResult | void {
    return html`
      <div>
        <oryx-time .stamp=${this.getDate(day, time.from)}></oryx-time>
        -
        <oryx-time .stamp=${this.getDate(day, time.to)}></oryx-time>
      </div>
    `;
  }

  protected getDate(day?: string, time?: string): Date {
    if (!day || !time) return new Date();
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }
}
