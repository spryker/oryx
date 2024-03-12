import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Product sort`,
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-search-product-sort></oryx-search-product-sort>`;
};

export const Demo = Template.bind({});
