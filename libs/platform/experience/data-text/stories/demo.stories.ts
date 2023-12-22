import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { DataTextComponentOptions } from '../data-text.model';

export default {
  title: `${storybookPrefix}/Data/Text`,
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

const Template: Story<DataTextComponentOptions> = (
  props: DataTextComponentOptions
): TemplateResult => {
  const { ...options } = props;
  resolve(ContextService).provide(document.body, 'PRODUCT', {
    sku: '1',
  });
  return html` <oryx-data-text .options=${options}></oryx-data-text> `;
};

export const Demo = Template.bind({});
