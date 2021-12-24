import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { IconSize as sizes, IconType } from './icon.model';
import './index';

const icons = ['close', 'add', 'desktop', 'mobile', 'delete', 'drag', 'loader'];

export default {
  title: 'Icon',
  argTypes: {},
} as Meta;

interface Props {
  type: IconType | string;
  size: sizes;
  customSize: string;
}

const IconTemplate: Story<Props> = ({ type }: Props): TemplateResult => {
  return html` <oryx-icon type=${type}></oryx-icon> `;
};

export const Icon = IconTemplate.bind({});

const AllIconsTemplate: Story<Props> = (): TemplateResult => {
  return html`
    ${icons.map((icon) => html` <oryx-icon type=${icon}></oryx-icon> `)}
  `;
};

export const AllIcons = AllIconsTemplate.bind({ title: 'test' });

Icon.argTypes = {
  type: {
    options: icons,
    control: { type: 'select' },
    defaultValue: 'close',
  },
};

const IconSizeTemplate: Story<Props> = ({
  size,
  customSize,
}: Props): TemplateResult => {
  return html`
    <oryx-icon type="desktop" size=${size}></oryx-icon>

    <h6>Sizes (small, medium, large)</h6>
    <oryx-icon type="desktop" size="small"></oryx-icon>
    <oryx-icon type="desktop" size="medium"></oryx-icon>
    <oryx-icon type="desktop" size="large"></oryx-icon>
    <h6>Custom sizes</h6>
    <oryx-icon type="desktop" style="--icon-size:${customSize}"></oryx-icon>
  `;
};

export const IconSize = IconSizeTemplate.bind({});

IconSize.argTypes = {
  size: {
    options: ['small', 'medium', 'large'],
    control: { type: 'radio' },
  },
  customSize: {
    control: { type: 'text' },
    defaultValue: '100px',
  },
};
