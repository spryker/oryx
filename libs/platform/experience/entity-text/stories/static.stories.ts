import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { EntityTextOptions } from '../entity-text.model';

export default {
  title: `${storybookPrefix}/Entity Text`,
};

type Props = EntityTextOptions /*& FieldComponentProperties*/;

const Template: Story = (): TemplateResult => {
  resolve(ContextService).provide(document.body, 'sku', {
    sku: '1',
  });
  const options = { entity: 'product', field: 'name' };
  return html`
    <h3>Plain Text</h3>
    <oryx-entity-text .options=${options}></oryx-entity-text>

    <h3>With prefix</h3>
    <oryx-entity-text
      .options=${{ ...options, prefix: 'prefix: ' }}
    ></oryx-entity-text>

    <h3>With tag</h3>
    <oryx-entity-text
      .options=${{ ...options, tag: HeadingTag.H1 }}
    ></oryx-entity-text>

    <h3>With prefix and tag</h3>
    <oryx-entity-text
      .options=${{ ...options, prefix: 'prefix: ', tag: HeadingTag.H1 }}
    ></oryx-entity-text>
  `;
};

export const Static = Template.bind({});
