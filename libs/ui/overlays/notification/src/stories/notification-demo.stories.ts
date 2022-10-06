import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { Schemes, Types } from '../notification.model';
import { bodyBackgroundColor } from './util';

interface Props {
  type: string;
  title: string;
  subtext: string;
  scheme: string;
  floating: boolean;
  closable: boolean;
  backgroundColor: string;
}

export default {
  title: `${storybookPrefix}/Overlays/Notification`,
  args: {
    type: Types.INFO,
    title: 'Title',
    subtext: 'Content text',
    backgroundColor: bodyBackgroundColor.options[0],
    scheme: Schemes.LIGHT,
    floating: false,
    closable: false,
  },
  argTypes: {
    backgroundColor: bodyBackgroundColor,
    type: {
      options: Object.values(Types),
      control: { type: 'radio' },
    },
    scheme: {
      options: Object.values(Schemes),
      control: { type: 'radio' },
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta;

const Template: Story<Props> = ({
  type,
  subtext,
  title,
  scheme,
  floating,
  closable,
  backgroundColor,
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
      @oryx.close=${(): void => console.log('close')}
      subtext=${subtext}
    >
      ${title}
      <span slot="subtext">${subtext}</span>
    </oryx-notification>
  `;
};
export const NotificationDemo = Template.bind({});
