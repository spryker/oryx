import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { OrderComponentProperties } from '../../src/models';

export default {
  title: `${storybookPrefix}/Confirmation Banner`,
  args: { orderId: 'DE--45' },
};

const Template: Story<OrderComponentProperties> = ({
  orderId,
}): TemplateResult => {
  return html`<oryx-order-confirmation-banner
    orderId="${orderId}"
  ></oryx-order-confirmation-banner>`;
};

export const Demo = Template.bind({});
