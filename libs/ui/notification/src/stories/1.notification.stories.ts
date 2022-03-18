import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../index';
import { Schemes, Types } from '../notification.model';
import { bodyBackgroundColor } from './utils';

export default {
  title: `${storybookPrefix}/Notification`,
} as Meta;

interface Props {
  type: string;
  title: string;
  subText: string;
  scheme: string;
  floating: boolean;
  closable: boolean;
  bodyBackgroundColor: string;
}

const Template: Story<Props> = ({
  type = Types.INFO,
  subText,
  title,
  scheme = Schemes.LIGHT,
  floating,
  closable,
  bodyBackgroundColor,
}: Props): TemplateResult => {
  return html`
    <style>
      body {
        background: ${bodyBackgroundColor};
      }
    </style>
    <oryx-notification
      type="${type}"
      scheme="${scheme}"
      ?floating="${floating}"
      ?closable="${closable}"
      @oryx.open=${(): void => console.log('open')}
      @oryx.close=${(): void => console.log('close')}
    >
      <span>${title}</span>
      <span>${subText}</span>
    </oryx-notification>
  `;
};
export const NotificationDemo = Template.bind({});
NotificationDemo.argTypes = {
  bodyBackgroundColor,
  type: {
    options: [Types.INFO, Types.ERROR, Types.WARNING, Types.SUCCESS],
    control: { type: 'radio' },
    defaultValue: Types.INFO,
  },
  scheme: {
    options: [Schemes.LIGHT, Schemes.DARK],
    control: { type: 'radio' },
    defaultValue: Schemes.LIGHT,
  },
  floating: {
    control: { type: 'boolean' },
    defaultValue: false,
  },
  closable: {
    control: { type: 'boolean' },
    defaultValue: true,
  },
  title: {
    control: { type: 'text' },
    defaultValue: 'Title',
  },
  subText: {
    control: { type: 'text' },
    defaultValue: 'Sub text',
  },
};
