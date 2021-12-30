import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import '../index';
import { iconTypes } from './model';

export default {
  title: 'Icon',
  argTypes: {},
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <div style="display:flex;gap:10px;--icon-size:50px">
      ${iconTypes.map((type) => html` <oryx-icon type=${type}></oryx-icon> `)}
    </div>
  `;
};

export const IconTypes = Template.bind({ title: 'test' });
