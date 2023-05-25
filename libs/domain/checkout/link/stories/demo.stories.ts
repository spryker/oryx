import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default { title: `${storybookPrefix}/Link` };

const Template: Story = (): TemplateResult => {
  return html`<oryx-checkout-link></oryx-checkout-link>`;
};

export const Demo = Template.bind({});
