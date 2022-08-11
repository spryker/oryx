import { getInjector } from '@spryker-oryx/injector';
import { LocaleService } from '@spryker-oryx/site';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';
import { setupProductMocks } from '../../../../src/mocks/product.mock';
import '../../index';

export default {
  title: `${storybookPrefix}/Price/Static`,
  loaders: [setupProductMocks],
} as unknown as Meta;

const getLocale = (): LocaleService => {
  return getInjector().inject(LocaleService);
};

const Template: Story<any> = (args): TemplateResult => {
  getLocale().set(args.locale);
  return html`
    <product-price sku="1" .options=${{ showOriginal: true }}></product-price>
  `;
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
