import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import './oryx-icon.component';

export default {
  title: 'Icon',
} as Meta;

interface Props {
  type: string;
}

const Template: Story<Props> = ({ type }: Props): TemplateResult =>
  html`<oryx-icon type=${type}></oryx-icon>`;

export const IconWithType = Template.bind({});

IconWithType.args = {
  type: 'add',
};
