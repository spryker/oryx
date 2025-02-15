import { OverlaysDecorator } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Media/Static`,
  decorators: [OverlaysDecorator()],
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h3>First image</h3>
    <oryx-product-media sku="1"/></oryx-product-media>

    <h3>Second image</h3>
    <oryx-product-media sku="1" .options=${{
      mediaIndex: 1,
    }} /></oryx-product-media>

    <h3>Third image</h3>
    <oryx-product-media sku="1" .options=${{
      mediaIndex: 2,
    }} /></oryx-product-media>

    <h3>4th (non existing) image</h3>
    <oryx-product-media sku="1" .options=${{
      mediaIndex: 3,
    }} /></oryx-product-media>

    <style>
      oryx-product-media {
        display: block;
        width: 300px;
        margin-bottom: 10px;
      }
    </style>
  `;
};

export const States = Template.bind({});
