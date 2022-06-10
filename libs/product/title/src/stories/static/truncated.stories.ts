import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';
import { setupProductMocks } from '../../../../src/mocks/product.mock';
import '../../index';

export default {
  title: `${storybookPrefix}/Title/Static`,
  loaders: [setupProductMocks],
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html` <div style="width:50px">
    ${Array.from(Array(6).keys()).map(
      (i) =>
        html`
          <product-title
            sku="1"
            .content=${{ tag: 'h' + (i + 1), singleLine: true }}
          ></product-title>
        `
    )}
  </div>`;
};

export const Truncated = Template.bind({});
