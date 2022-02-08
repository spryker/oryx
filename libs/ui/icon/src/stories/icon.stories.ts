import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../constant';
import { IconSize as sizes, IconType } from '../icon.model';
import '../index';
import { iconTypes } from './model';

export default {
  title: `${storybookPrefix}/Icon`,
} as Meta;

interface Props {
  type: IconType | string;
  size: sizes;
  color: string;
}

const Template: Story<Props> = ({
  type,
  size,
  color,
}: Props): TemplateResult => {
  return html`
    <div style="color: ${color}">
      <oryx-icon type=${type} size=${size}></oryx-icon>
    </div>
  `;
};

export const Icon = Template.bind({});
Icon.argTypes = {
  type: {
    options: iconTypes,
    control: { type: 'select' },
    defaultValue: 'close',
  },

  size: {
    options: ['large', 'medium', 'small'],
    control: { type: 'radio' },
  },
  color: {
    control: { type: 'color' },
    defaultValue: 'red',
  },
};
