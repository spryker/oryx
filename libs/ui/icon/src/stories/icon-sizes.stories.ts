import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../constant';
import { IconType } from '../icon.model';
import '../index';
import { iconTypes } from './model';

export default {
  title: `${storybookPrefix}/Icon`,
  argTypes: {},
} as Meta;

interface Props {
  type: IconType | string;
  customSize: string;
}

const Template: Story<Props> = ({
  type,
  customSize,
}: Props): TemplateResult => {
  return html`
    <style>
      oryx-icon {
        border: solid 1px var(--oryx-color-ink);
      }
    </style>
    <div style="display:flex;gap:10px">
      <oryx-icon type=${type} size="large"></oryx-icon>
      <oryx-icon type=${type} size="medium"></oryx-icon>
      <oryx-icon type=${type} size="small"></oryx-icon>
      <oryx-icon type=${type} style="--icon-size:${customSize}"></oryx-icon>
    </div>
  `;
};

export const IconSizes = Template.bind({});

IconSizes.argTypes = {
  type: {
    options: iconTypes,
    control: { type: 'select' },
    defaultValue: 'desktop',
  },
  customSize: {
    control: { type: 'text' },
    defaultValue: '50px',
  },
};
