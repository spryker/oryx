import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { EntityLinkOptions } from '../entity-link.model';

export default {
  title: `${storybookPrefix}/Entity Link`,
  args: {
    entity: 'merchant',
    field: 'contact.phone',
    icon: IconTypes.Phone,
    label: 'Call us',
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

type Props = EntityLinkOptions;

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { ...options } = props;
  resolve(ContextService).provide(document.body, 'merchant', {
    id: '1',
  });
  return html` <oryx-entity-link .options=${options}></oryx-entity-link> `;
};

export const Demo = Template.bind({});
