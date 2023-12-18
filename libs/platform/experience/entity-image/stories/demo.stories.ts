import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { EntityImageOptions } from '../entity-image.model';

export default {
  title: `${storybookPrefix}/Entity Image`,
  args: {
    entity: 'merchant',
    field: 'banner',
    renderFallback: false,
  },
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

type Props = EntityImageOptions;

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { ...options } = props;
  resolve(ContextService).provide(document.body, 'merchant', {
    id: '1',
  });
  return html` <oryx-entity-image .options=${options}></oryx-entity-image> `;
};

export const Demo = Template.bind({});
