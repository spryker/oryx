import { resolve } from '@spryker-oryx/di';
import { OrderService } from '@spryker-oryx/order';
import { MockOrderService, OrderItemCount } from '@spryker-oryx/order/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

interface Props {
  itemCount: OrderItemCount;
  limit?: number;
  threshold?: number;
}

export default {
  title: `${storybookPrefix}/Entries/Static`,
} as unknown as Meta;

const Template: Story<Props> = (props): TemplateResult => {
  const orderService = resolve(OrderService) as unknown as MockOrderService;
  orderService.changeItemCount(props.itemCount);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { itemCount, ...options } = props;
  return html`<oryx-order-entries .options=${options}></oryx-order-entries>`;
};

export const UnderDefaultThreshold = Template.bind({});
export const AboveDefaultThreshold = Template.bind({});
export const UnderShortThreshold = Template.bind({});
export const AboveShortThreshold = Template.bind({});
export const UnderLongThreshold = Template.bind({});
export const AboveLongThreshold = Template.bind({});

UnderDefaultThreshold.args = {
  itemCount: OrderItemCount.UnderThreshold,
};

UnderShortThreshold.args = {
  itemCount: OrderItemCount.UnderThreshold,
  threshold: 0,
  limit: 2,
};

AboveShortThreshold.args = {
  threshold: 0,
  limit: 3,
};

UnderLongThreshold.args = {
  itemCount: OrderItemCount.UnderThreshold,
  threshold: 5,
  limit: 3,
};

AboveLongThreshold.args = {
  threshold: 5,
  limit: 3,
};
