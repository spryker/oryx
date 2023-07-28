import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Locale selector`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-site-locale-selector></oryx-site-locale-selector> `;
};

export const Demo = Template.bind({});
