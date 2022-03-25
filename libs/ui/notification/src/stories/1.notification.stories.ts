import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../index';
import { Schemes, Types } from '../notification.model';
import { bodyBackgroundColor } from './util';

export default {
  title: `${storybookPrefix}/Notification`,
} as Meta;

interface Props {
  type: string;
  title: string;
  subtext: string;
  scheme: string;
  floating: boolean;
  closable: boolean;
  backgroundColor: string;
}

const Template: Story<Props> = ({
  type = Types.INFO,
  subtext = '',
  title = '',
  scheme = Schemes.LIGHT,
  floating = false,
  closable = false,
  backgroundColor = bodyBackgroundColor.options[0],
}: Props): TemplateResult => {
  return html`
    <style>
      body {
        background: ${backgroundColor};
      }
    </style>
    <oryx-notification
      type="${type}"
      scheme="${scheme}"
      ?floating="${floating}"
      ?closable="${closable}"
      @oryx.open=${(): void => console.log('open')}
      @oryx.close=${(): void => console.log('close')}
      subtext=${subtext}
    >
      ${title}
      <span slot="subtext">${subtext}</span>
    </oryx-notification>
  `;
};
export const NotificationDemo = Template.bind({});
NotificationDemo.argTypes = {
  backgroundColor: bodyBackgroundColor,
  type: {
    options: [Types.INFO, Types.ERROR, Types.WARNING, Types.SUCCESS],
    control: { type: 'radio' },
  },
  scheme: {
    options: [Schemes.LIGHT, Schemes.DARK],
    control: { type: 'radio' },
  },
  floating: {
    control: { type: 'boolean' },
    defaultValue: false,
  },
  closable: {
    control: { type: 'boolean' },
    defaultValue: false,
  },
  title: {
    control: { type: 'text' },
    defaultValue: 'Title',
  },
  subtext: {
    control: { type: 'text' },
    defaultValue: 'Content text',
  },
};
