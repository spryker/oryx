import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.storybook/constant';
import { Size } from '../../../../utilities';
import { ButtonType } from '../button.model';
import '../index';

export default {
  title: `${storybookPrefix}/Actions/Button`,
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
  type: ButtonType.Primary,
  size: Size.large,
  icon: undefined,
  message: 'Button',
  disabled: false,
  loading: false,
  outline: false,
};

ButtonDemo.argTypes = {
  type: {
    options: Object.values(ButtonType),
    control: { type: 'select' },
  },
  size: {
    options: Object.values(Size),
    control: { type: 'select' },
  },
  icon: {
    description: 'Button icon',
    control: { type: 'text' },
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
};
