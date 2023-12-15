import { ContentMixin } from '@spryker-oryx/experience';
import { MerchantMixin, MerchantScheduleSlot } from '@spryker-oryx/merchant';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { openingHoursStyles } from './opening-hours.styles';

export class MerchantOpeningHoursComponent extends MerchantMixin(
  ContentMixin(LitElement)
) {
  static styles = openingHoursStyles;

  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();

    if (!merchant?.schedule?.opened) return;

    return html`
      <h3>${this.i18n('merchant.openings-hours')}</h3>

      <ul>
        ${repeat(
          merchant.schedule.opened,
          (weekday) =>
            html`<li>
              <oryx-site-day .day=${weekday.day}></oryx-site-day>
              ${this.renderTimeSlots(weekday)}
            </li>`
        )}
      </ul>
    `;
  }

  protected renderTimeSlots(slot: MerchantScheduleSlot): TemplateResult | void {
    if (slot.day) {
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
  }

  protected getDate(time?: string): Date | undefined {
    if (!time) return;
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }
}
