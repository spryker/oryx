import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Address Form`,
} as unknown as Meta;

interface Props {
  country: string;
  fallbackCountry: string;
}

const Template: Story<Props> = (props): TemplateResult => {
  return html`<oryx-address-form
    .country="${props.country}"
    .fallbackCountry="${props.fallbackCountry}"
  ></oryx-address-form>`;
};

export const Demo = Template.bind({});

Demo.args = {
  country: 'DE',
  fallbackCountry: 'DE',
};

const countries = ['DE', 'US', 'AT', 'PT', 'ES'];
Demo.argTypes = {
  country: {
    control: { type: 'select' },
    options: countries,
  },
  fallbackCountry: {
    control: { type: 'select' },
    options: countries,
  },
};
