import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Sorting`,
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`<search-product-sort></search-product-sort>`;
};

export const Demo = Template.bind({});
