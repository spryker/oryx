import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { DataImageComponentOptions } from '../data-image.model';

export default {
  title: `${storybookPrefix}/Data/Image`,
  args: {
    entity: 'merchant',
    field: 'banner',
    renderFallback: false,
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story<DataImageComponentOptions> = (
  props: DataImageComponentOptions
): TemplateResult => {
  const { ...options } = props;
  resolve(ContextService).provide(document.body, 'merchant', {
    id: '1',
  });
  return html` <oryx-data-image .options=${options}></oryx-data-image> `;
};

export const Demo = Template.bind({});
