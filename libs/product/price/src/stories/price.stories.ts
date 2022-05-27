import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import '../index';
import { setupProductMocks } from './product-mocks';

export default {
  title: `${storybookPrefix}/Price`,
  loaders: [setupProductMocks],
} as Meta;

const Template: Story<{ code: string; original: boolean }> = ({
  code,
  original,
}): TemplateResult => {
  if (!original) code = '2';

  return html`<product-price .code="${code}" />`;
};

export const Price = Template.bind({});

Price.args = {
  code: '1',
  original: true,
};

Price.argTypes = {
  code: {
    control: { type: 'hidden', readonly: true },
  },
};
