import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { DateComponentAttributes } from '../date.model';

export default {
  title: `${storybookPrefix}/date`,
  args: {
    stamp: new Date('2023-04-26'),
  },
  argTypes: {
    i18nToken: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<DateComponentAttributes> = (
  props: DateComponentAttributes
): TemplateResult => {
  return html`<oryx-date
    .stamp=${props.stamp}
    .i18nToken=${props.i18nToken}
  ></oryx-date>`;
};

export const Demo = Template.bind({});
