import { AlertType } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';
import { NotificationComponentAttributes, Scheme } from '../notification.model';
import { bodyBackgroundColor } from './util';

interface Props {
  title: string;
  subtext: string;
  backgroundColor: string;
}

export default {
  title: `${storybookPrefix}/Overlays/Notification`,
  args: {
    type: AlertType.Info,
    title: 'Title',
    subtext: 'Content text',
    backgroundColor: bodyBackgroundColor.options[0],
    scheme: Scheme.Light,
    floating: false,
    closable: false,
  },
  argTypes: {
    backgroundColor: bodyBackgroundColor,
    type: {
      options: [
        AlertType.Info,
        AlertType.Success,
        AlertType.Warning,
        AlertType.Error,
      ],
      control: { type: 'radio' },
    },
    scheme: {
      options: [Scheme.Light, Scheme.Dark],
      control: { type: 'radio' },
    },
    title: { table: { category: 'demo' } },
    subtext: { table: { category: 'demo' } },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta;

const Template: Story<NotificationComponentAttributes & Props> = ({
  type,
  subtext,
  title,
  scheme,
  floating,
  closable,
  backgroundColor,
}: NotificationComponentAttributes & Props): TemplateResult => {
  return html`
    <style>
      body {
        background: ${backgroundColor};
      }
    </style>
    <oryx-notification
      type="${ifDefined(type)}"
      scheme="${ifDefined(scheme)}"
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
export const Demo = Template.bind({});
