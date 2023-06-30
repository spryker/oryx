import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Cart totals/components/total`,
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-cart-totals-total></oryx-cart-totals-total>`;
};

export const demo = Template.bind({});
