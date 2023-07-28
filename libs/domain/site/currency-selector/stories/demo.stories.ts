import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Currency selector`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-site-currency-selector></oryx-site-currency-selector> `;
};

export const Demo = Template.bind({});
