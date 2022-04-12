import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.storybook/constant';
import '../index';

export default {
  title: `${storybookPrefix}/Title`,
} as Meta;

const Template: Story<{ code: string }> = ({ code }): TemplateResult => {
  return html`<product-title .code="${code}" />`;
};

export const Title = Template.bind({});
Title.argTypes = {
  code: {
    control: { type: 'text' },
    defaultValue: '1',
  },
};
