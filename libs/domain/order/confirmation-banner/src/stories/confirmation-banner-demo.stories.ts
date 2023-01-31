import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Confirmation Banner`,
} as unknown as Meta;

interface Props {
  orderId: string;
}

const Template: Story<Props> = ({ orderId }): TemplateResult => {
  return html`<oryx-order-confirmation-banner
    .order-id=${orderId}
  ></oryx-order-confirmation-banner>`;
};

export const Demo = Template.bind({});

Demo.args = {
  orderId: 'DE--45',
};
