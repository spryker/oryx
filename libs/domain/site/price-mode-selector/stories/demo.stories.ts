import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Price mode selector`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-price-mode-selector></oryx-price-mode-selector> `;
};

export const Demo = Template.bind({});
