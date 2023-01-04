import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/site';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Price/Static`,
} as unknown as Meta;

const Template: Story<any> = (args): TemplateResult => {
  resolve(LocaleService).set(args.locale);
  return html` <product-price sku="1"></product-price> `;
};

export const EurUsFormat = Template.bind({});
export const EurDeFormat = Template.bind({});
export const EurNlFormat = Template.bind({});

EurUsFormat.args = {
  locale: 'en-US',
};
EurNlFormat.args = {
  locale: 'nl-NL',
};
EurDeFormat.args = {
  locale: 'de-DE',
};
