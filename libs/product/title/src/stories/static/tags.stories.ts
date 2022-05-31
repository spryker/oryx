import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';
import '../../index';
import { setupProductMocks } from '../product-mocks';

export default {
  title: `${storybookPrefix}/Title/Static`,
  loaders: [setupProductMocks],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    ${Array.from(Array(6).keys()).map(
      (i) =>
        html` <product-title sku="1" .content=${{ tag: 'h' + (i + 1) }} /> `
    )}
  `;
};

export const Tags = Template.bind({});
