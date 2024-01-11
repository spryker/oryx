import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Discontinued`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Discontinued without note</h3>
    <oryx-product-discontinued sku="discontinued"></oryx-product-discontinued>

    <h3>Discontinued with note</h3>
    <oryx-product-discontinued
      sku="discontinued-with-note"
    ></oryx-product-discontinued>

    <h3>Not discontinued</h3>
    <oryx-product-discontinued sku="1"></oryx-product-discontinued>
  `;
};

export const Static = Template.bind({});
