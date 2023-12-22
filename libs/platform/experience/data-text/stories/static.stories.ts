import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Data/Text`,
};

const Template: Story = (): TemplateResult => {
  resolve(ContextService).provide(document.body, 'PRODUCT', {
    sku: '1',
  });
  const options = { entity: 'product', field: 'name' };
  return html`
    <h3>Plain Text</h3>
    <oryx-data-text .options=${options}></oryx-data-text>

    <h3>With prefix</h3>
    <oryx-data-text
      .options=${{ ...options, prefix: 'prefix: ' }}
    ></oryx-data-text>

    <h3>With tag</h3>
    <oryx-data-text
      .options=${{ ...options, tag: HeadingTag.H1 }}
    ></oryx-data-text>

    <h3>With prefix and tag</h3>
    <oryx-data-text
      .options=${{ ...options, prefix: 'prefix: ', tag: HeadingTag.H1 }}
    ></oryx-data-text>
  `;
};

export const Static = Template.bind({});
