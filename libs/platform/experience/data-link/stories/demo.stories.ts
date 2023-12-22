import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { EntityLinkOptions } from '../data-link.model';

export default {
  title: `${storybookPrefix}/Data/Link`,
  args: {
    entity: 'merchant',
    field: 'contact.phone',
    icon: IconTypes.Phone,
    label: 'Call us',
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story<EntityLinkOptions> = (
  props: EntityLinkOptions
): TemplateResult => {
  const { ...options } = props;
  resolve(ContextService).provide(document.body, 'merchant', {
    id: '1',
  });
  return html` <oryx-data-link .options=${options}></oryx-data-link> `;
};

export const Demo = Template.bind({});
