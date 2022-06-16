import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';
import { setupProductMocks } from '../../../../src/mocks';
import '../../index';

export default {
  title: `${storybookPrefix}/Description/Static`,
  loaders: [setupProductMocks],
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <product-description
      sku="1"
      .content=${{ truncateCharacterCount: 100, isTruncated: true }}
    />
  `;
};

export const Collapsed = Template.bind({});
