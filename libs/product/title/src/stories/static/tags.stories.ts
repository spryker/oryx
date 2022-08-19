import { setUpMockProviders } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';
import { mockProductProviders } from '../../../../src/mocks';

export default {
  title: `${storybookPrefix}/Title/Static`,
  loaders: [setUpMockProviders(mockProductProviders)],
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    ${Array.from(Array(6).keys()).map(
      (i) =>
        html`
          <product-title
            sku="1"
            .options=${{ tag: 'h' + (i + 1) }}
          ></product-title>
        `
    )}
  `;
};

export const Tags = Template.bind({});
