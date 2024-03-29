import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  ButtonColor,
  ButtonComponentAttributes,
  ButtonType,
} from '../button.model';
import { renderButton } from './util';

export default {
  title: `${storybookPrefix}/Actions/Button`,
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    text: 'Action',
    color: ButtonColor.Primary,
    disabled: false,
    loading: false,
    confirmed: false,
    block: false,
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
      options: [ButtonColor.Primary, ButtonColor.Neutral, ButtonColor.Error],
      control: { type: 'select' },
    },
    icon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
    label: {
      control: { type: 'text' },
    },
    href: {
      control: { type: 'text' },
    },
    slotted: {
      options: ['link', 'button', 'content'],
      control: { type: 'select' },
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
