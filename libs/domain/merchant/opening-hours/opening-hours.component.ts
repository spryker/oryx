import { ContentMixin } from '@spryker-oryx/experience';
import { MerchantMixin, MerchantScheduleSlot } from '@spryker-oryx/merchant';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { openingHoursStyles } from './opening-hours.styles';

export class MerchantOpeningsHoursComponent extends MerchantMixin(
  ContentMixin(LitElement)
) {
  static styles = openingHoursStyles;

  protected override render(): TemplateResult | void {
    const merchant = this.$merchant();

    if (!merchant?.schedule?.opened) return;

    return html`
      <oryx-heading .tag=${HeadingTag.H3}>
        ${this.i18n('merchant.openings-hours')}
      </oryx-heading>

      <ul>
        ${repeat(
          merchant.schedule.opened,
          (weekday) =>
            html`<li>
              ${this.i18n(`merchant.weekdays.${weekday.day}`)}
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
        (time) =>
          html` <div>
            <oryx-time .stamp=${this.getDate(slot.day, time.from)}></oryx-time>
            -
            <oryx-time .stamp=${this.getDate(slot.day, time.to)}></oryx-time>
          </div>`
      )}`;
    }
  }

  protected getDate(day?: string, time?: string): Date | undefined {
    if (!day || !time) return;
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }
}
