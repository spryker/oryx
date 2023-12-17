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
    type: {
      control: {
        type: 'select',
        options: [
          'weekdays',
          'dates',
          undefined,
        ] as MerchantScheduleComponentOptions['type'][],
      },
    },

    skipBeforeLast: {
      control: {
        type: 'select',
        options: ['week', 'month', 'quarter', 'year', undefined],
      },
    },

    skipAfterNext: {
      control: {
        type: 'select',
        options: ['week', 'month', 'quarter', 'year', undefined],
      },
    },
  },
  parameters: { chromatic: { disableSnapshot: true } },
};

const Template: Story<MerchantScheduleComponentOptions> = (
  props: MerchantScheduleComponentOptions
): TemplateResult => {
  return html` <oryx-merchant-schedule
    merchant="1"
    .options=${{ ...props }}
  ></oryx-merchant-schedule>`;
};

export const Demo = Template.bind({});
