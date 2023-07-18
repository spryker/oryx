import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../.constants';
import {
  ButtonColor,
  ButtonComponentAttributes,
  ButtonType,
} from '../button.model';
import { renderButton } from './util';

export default {
  title: `${storybookPrefix}/Actions/Action`,
  args: {
    text: 'Action',
    color: ButtonColor.Primary,
  },
  argTypes: {
    type: {
      options: [
        ButtonType.Text,
        ButtonType.Solid,
        ButtonType.Outline,
        ButtonType.Icon,
      ],
      control: { type: 'select' },
    },
    color: {
      options: [
        ButtonColor.Primary,
        ButtonColor.Secondary,
        ButtonColor.Neutral,
        ButtonColor.Highlight,
        ButtonColor.Error,
        ButtonColor.Warning,
        ButtonColor.Info,
        ButtonColor.Success,
      ],
      control: { type: 'select' },
    },
    icon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
    label: {
      control: { type: 'text' },
    },
    slotted: {
      options: ['link', 'button', 'content'],
      control: { type: 'select' },
      table: { category: 'demo' },
    },
    href: {
      control: { type: 'text' },
      table: { category: 'demo' },
    },
  },
} as Meta;

interface Props {
  text: string;
  href: string;
  slotted: 'link' | 'button' | 'content';
}

const Template: Story<ButtonComponentAttributes & Props> = (
  props
): TemplateResult => {
  return renderButton(props);
};

export const Demo = Template.bind({});
