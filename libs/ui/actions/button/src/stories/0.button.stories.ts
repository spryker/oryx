import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.storybook/constant';
import { Size } from '../../../../utilities';
import { ButtonType } from '../button.model';
import '../index';

export default {
  title: `${storybookPrefix}/Actions/Button`,
  argTypes: {
    type: {
      description: 'Visibility button UI',
      options: Object.values(ButtonType),
      defaultValue: ButtonType.Primary,
      control: { type: 'select' },
    },
    size: {
      description: 'Button size',
      options: Object.values(Size),
      defaultValue: Size.large,
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
  size: Size;
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
    <div class="button-component">
      <oryx-button
        type=${type}
        size=${size}
        ?loading=${loading}
        ?outline=${outline}
        ?icon=${icon}
      >
        <button ?disabled=${disabled}>
          ${icon ? html` <oryx-icon type=${icon}></oryx-icon>` : ''} ${message}
        </button>
      </oryx-button>

      <oryx-button
        type=${type}
        size=${size}
        ?loading=${loading}
        ?outline=${outline}
        ?icon=${icon}
      >
        <a href="/" ?disabled=${disabled}>
          ${icon ? html` <oryx-icon type=${icon}></oryx-icon>` : ''} Link
        </a>
      </oryx-button>
    </div>
    <style>
      .button-component {
        width: auto;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    </style>
  `;
};

export const ButtonDemo = Template.bind({});

ButtonDemo.args = {
  message: 'Button',
  disabled: false,
  icon: undefined,
  loading: false,
  outline: false,
};

ButtonDemo.argTypes = {
  icon: {
    control: { type: 'text' },
  },
};
