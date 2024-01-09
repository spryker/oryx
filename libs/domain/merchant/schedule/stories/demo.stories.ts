import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { MERCHANT } from '@spryker-oryx/merchant';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { MerchantScheduleComponentOptions } from '../schedule.model';

export default {
  title: `${storybookPrefix}/Schedule`,
  args: {
    tag: HeadingTag.H3,
  },
  argTypes: {
    tag: {
      control: {
        type: 'select',
        options: [
          HeadingTag.Bold,
          HeadingTag.H1,
          HeadingTag.H2,
          HeadingTag.H3,
          HeadingTag.H4,
          HeadingTag.H5,
          HeadingTag.H6,
          HeadingTag.Small,
          HeadingTag.Strong,
          HeadingTag.Subtitle,
        ],
      },
    },
    weeksBefore: { control: { type: 'number' } },
    weeksAfter: { control: { type: 'number' } },
  },
  parameters: { chromatic: { disableSnapshot: true } },
};

const Template: Story<MerchantScheduleComponentOptions> = (
  props: MerchantScheduleComponentOptions
): TemplateResult => {
  resolve(ContextService).provide(document.body, MERCHANT, { id: '1' });
  return html` <oryx-merchant-schedule
    .options=${{ ...props }}
  ></oryx-merchant-schedule>`;
};

export const Demo = Template.bind({});
