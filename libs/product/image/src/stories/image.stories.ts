import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import '../index';
import { setupProductMocks } from './product-mocks';

export default {
  title: `${storybookPrefix}/Image`,
  loaders: [setupProductMocks],
} as Meta;

const Template: Story<{ code: string }> = ({ code }): TemplateResult => {
  return html`<product-image .code="${code}" />`;
};

export const Image = Template.bind({});

Image.args = {
  code: '1',
};

Image.argTypes = {
  code: {
    control: { type: 'text' },
  },
};
