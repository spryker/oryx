import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Currency selector`,
} as Meta;

// TODO: remove bg color when new color system is in place
const Template: Story = (): TemplateResult => {
  return html`<oryx-site-currency-selector></oryx-site-currency-selector>
    <style>
      oryx-site-currency-selector {
        background: gray;
        padding: 10px;
      }
    </style> `;
};

export const Demo = Template.bind({});
