import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { EntityTextOptions } from '../entity-text.model';

export default {
  title: `${storybookPrefix}/EntityText`,
  args: {
    entity: 'product',
    field: 'name',
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

type Props = EntityTextOptions /*& FieldComponentProperties*/;

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { ...options } = props;
  resolve(ContextService).provide(
    document.body,
    'sku' /* ProductContext.SKU */,
    {
      sku: '1',
    }
  );
  return html` <oryx-entity-text .options=${options}></oryx-entity-text> `;
};

export const EntityTextDemo = Template.bind({});
