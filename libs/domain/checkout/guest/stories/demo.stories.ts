import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default { title: `${storybookPrefix}/Guest` };

const Template: Story = (): TemplateResult => {
  return html`<oryx-checkout-guest></oryx-checkout-guest>`;
};

export const Demo = Template.bind({});
