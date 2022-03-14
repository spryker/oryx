import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../constant';
import { ButtonSize, ButtonType } from '../button.model';
import '../index';

export default {
  title: `${storybookPrefix}/actions/Button`,
  argTypes: {
    type: {
      description: 'Visibility button UI',
      options: Object.values(ButtonType),
      defaultValue: ButtonType.Primary,
      control: { type: 'select' },
    },
    size: {
      description: 'Button size',
      options: Object.values(ButtonSize),
      defaultValue: ButtonSize.large,
      control: { type: 'select' },
    },
    message: {
      description: 'Button message',
    },
    disabled: {
      description: 'Button disabled',
    },
    loading: {
      description: 'Button loader',
    },
    icon: {
      description: 'Button icon',
    },
  },
} as Meta;

interface Props {
  type: ButtonType;
  size: ButtonSize;
  disabled: boolean;
  message: string;
  icon: string;
  loading: boolean;
  outline: boolean;
}

const Template: Story<Props> = ({
  disabled,
  type,
  size,
  message,
  icon,
  loading,
  outline,
}: Props): TemplateResult => {
  return html`
    <oryx-button
      .type=${type}
      .size=${size}
      .icon=${icon}
      ?loading=${loading}
      ?outline=${outline}
    >
      <button ?disabled=${disabled}>${message}</button>
    </oryx-button>

    <oryx-button
      .type=${type}
      .size=${size}
      .icon=${icon}
      ?loading=${loading}
      ?outline=${outline}
    >
      <a href="/" ?disabled=${disabled}>link</a>
    </oryx-button>
  `;
};

export const ButtonComponent = Template.bind({});

ButtonComponent.args = {
  message: 'Button',
  disabled: false,
  icon: undefined,
  loading: false,
  outline: false,
};

ButtonComponent.argTypes = {
  icon: {
    control: { type: 'text' },
  },
};
