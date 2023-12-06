import { storybookDefaultViewports } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Quantity input/Static`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <p>Without label</p>
    <oryx-quantity-input min=${0} value=${1}></oryx-quantity-input>

    <p>With label</p>
    <oryx-quantity-input
      min=${0}
      value=${1}
      label="Quantity"
    ></oryx-quantity-input>

    <p>Long text</p>
    <oryx-quantity-input
      min=${0}
      value=${1}
      label="Long label text content for example"
    ></oryx-quantity-input>
  `;
};
export const Label = Template.bind({});

Label.parameters = {
  chromatic: {
    delay: 2000,
    viewports: [
      storybookDefaultViewports.mobile.min,
      storybookDefaultViewports.desktop.min,
    ],
  },
};
