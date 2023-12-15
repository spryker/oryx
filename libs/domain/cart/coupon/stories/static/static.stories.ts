import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

import { CouponComponent } from '../../index';

export default {
  title: `${storybookPrefix}/Coupon/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h2>No added coupons</h2>
    <oryx-cart-coupon cartId="empty"></oryx-cart-coupon>

    <h2>One added coupon</h2>
    <oryx-cart-coupon></oryx-cart-coupon>

    <h2>Two added coupons</h2>
    <oryx-cart-coupon cartId="multiple"></oryx-cart-coupon>

    <h2>Two added coupons (one success, one failure)</h2>
    <oryx-cart-coupon class="failed-coupon"></oryx-cart-coupon>
  `;
};

export const States = Template.bind({});

States.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  const wait = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await wait(1000);

  const component = obj.canvasElement.querySelector(
    '.failed-coupon'
  ) as CouponComponent;

  if (component.coupon) {
    component.coupon!.value = 'test invalid coupon';
    const button = component.shadowRoot?.querySelector(
      'oryx-button'
    ) as HTMLButtonElement;

    button.click();
  }
};
