import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  ActionColor,
  ActionComponentAttributes,
  ActionSize,
  ActionType,
} from '../action.model';
import { Props, renderAction } from './util';

export default {
  title: `${storybookPrefix}/Actions/Action`,
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    text: 'Action',
    color: ActionColor.Primary,
    disabled: false,
    loading: false,
    confirmed: false,
    block: false,
    mark: '99+',
  },
  argTypes: {
    type: {
      options: [ActionType.Text, ActionType.Icon, ActionType.Tile],
      control: { type: 'select' },
    },
    color: {
      options: [ActionColor.Primary, ActionColor.Neutral, ActionColor.Error],
      control: { type: 'select' },
    },
    icon: {
      options: getAppIcons(),
      control: { type: 'select' },
    },
    label: {
      control: { type: 'text' },
    },
    mark: {
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

const Template: Story<ActionComponentAttributes & Props> = (
  props
): TemplateResult => {
  return html`${[
    renderAction({ ...props, type: ActionType.Tile }),
    renderAction({
      ...props,
      type: ActionType.Tile,
      icon: IconTypes.Cart,
    }),
    renderAction({
      ...props,
      type: ActionType.Tile,
      icon: IconTypes.Cart,
    }),
    renderAction({
      type: ActionType.Tile,
      icon: IconTypes.Cart,
      text: IconTypes.Cart,
      mark: '1',
    }),
    renderAction({
      type: ActionType.Tile,
      text: 'login login again',
    }),
    renderAction({
      ...props,
      size: ActionSize.Lg,
      type: ActionType.Tile,
      icon: IconTypes.Cart,
    }),
    renderAction({
      text: 'Login',
      size: ActionSize.Lg,
      type: ActionType.Tile,
      icon: IconTypes.User,
    }),
    renderAction({
      text: 'Login',
      type: ActionType.Tile,
      icon: IconTypes.User,
    }),
    renderAction({
      text: 'Login',
      size: ActionSize.Sm,
      type: ActionType.Tile,
      icon: IconTypes.User,
    }),
    renderAction({
      text: 'Login',
      size: ActionSize.Sm,
      type: ActionType.Tile,
      icon: IconTypes.User,
      loading: true,
    }),
    renderAction({
      text: 'Login',
      size: ActionSize.Sm,
      type: ActionType.Tile,
      icon: IconTypes.User,
      loading: true,
      mark: '1',
    }),
    renderAction({
      text: 'Login',
      size: ActionSize.Sm,
      type: ActionType.Tile,
      icon: IconTypes.User,
      confirmed: true,
    }),
    renderAction({
      text: 'Login',
      size: ActionSize.Sm,
      type: ActionType.Tile,
      icon: IconTypes.User,
      confirmed: true,
      mark: '1',
    }),
  ]} `;
};

export const Demo = Template.bind({});
