import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { DayComponentAttributes } from '../day.model';

export default {
  title: `${storybookPrefix}/day`,
  args: {
    day: 'monday',
  },
  argTypes: {
    day: {
      control: {
        type: 'select',
        options: [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ],
      },
    },
    i18nToken: { control: { type: 'text' } },
  },
  parameters: { chromatic: { disableSnapshot: true } },
};

const Template: Story<DayComponentAttributes> = (
  props: DayComponentAttributes
): TemplateResult => {
  return html`<oryx-day
    .day=${props.day}
    .i18nToken=${props.i18nToken}
  ></oryx-date>`;
};

export const Demo = Template.bind({});
