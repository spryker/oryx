import { setUpMockProviders } from '@spryker-oryx/injector';
import { OverlaysDecorator } from '@spryker-oryx/ui/utilities';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';
import { mockProductProviders } from '../../../../src/mocks';

export default {
  title: `${storybookPrefix}/Media/Static`,
  loaders: [setUpMockProviders(mockProductProviders)],
  decorators: [OverlaysDecorator()],
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <style>
      product-media {
        display: block;
        width: 300px;
        height: 300px;
      }
    </style>

    <p>Images</p>
    <product-media sku="1"/></product-media>

    <p>Missed large</p>
    <product-media sku="1" .options=${{ hdSrc: null }} /></product-media>

    <p>Missed small</p>
    <product-media sku="1" .options=${{ src: null }} /></product-media>

    <p>Fallback image</p>
    <product-media sku="1" .options=${{
      src: null,
      hdSrc: null,
    }} /></product-media>
  `;
};

export const States = Template.bind({});
