import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Summary`,
};

const Template: Story = (): TemplateResult => {
  return html`<oryx-order-summary></oryx-order-summary>`;
};

export const Demo = Template.bind({});
