import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
title: `${storybookPrefix}/Link`,
parameters: { 
  chromatic: { 
     disableSnapshot: true 
  }
},
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-checkout-link></oryx-checkout-link>`;
};

export const Demo = Template.bind({});
