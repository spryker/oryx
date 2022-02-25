import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../constant';
import { IconProperties, IconTypes } from '../icon.model';
import '../index';

export default { title: `${storybookPrefix}/Icon` } as Meta;

interface Props extends IconProperties {
  color: string;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <h1>Inherited current colors</h1>
    <div class="icon-set" style="color: red;">
      <oryx-icon type=${props.type}></oryx-icon>
      <oryx-icon type=${props.type}></oryx-icon>
      <oryx-icon type=${props.type}></oryx-icon>
      <oryx-icon type=${props.type}></oryx-icon>
      <oryx-icon type=${props.type}></oryx-icon>
    </div>

    <h1>Current color</h1>
    <div class="icon-set">
      <oryx-icon
        type=${props.type}
        style="color: var(--oryx-color-brand-lighter);"
      ></oryx-icon>
      <oryx-icon
        type=${props.type}
        style="color: var(--oryx-color-brand-light);"
      ></oryx-icon>
      <oryx-icon
        type=${props.type}
        style="color: var(--oryx-color-brand);"
      ></oryx-icon>
      <oryx-icon
        type=${props.type}
        style="color: var(--oryx-color-brand-dark);"
      ></oryx-icon>
      <oryx-icon
        type=${props.type}
        style="color: var(--oryx-color-brand-darker);"
      ></oryx-icon>
    </div>

    <h1>Background color</h1>
    <div class="icon-set">
      <oryx-icon
        type=${props.type}
        style="color: var(--oryx-color-brand-lighter);background-color: var(--oryx-color-brand-darker);"
      ></oryx-icon>
      <oryx-icon
        type=${props.type}
        style="color: var(--oryx-color-brand-light);background-color: var(--oryx-color-brand-dark);"
      ></oryx-icon>
      <oryx-icon
        type=${props.type}
        style="color: var(--oryx-color-brand);background-color: var(--oryx-color-brand-ink);"
      ></oryx-icon>
      <oryx-icon
        type=${props.type}
        style="color: var(--oryx-color-brand-dark);background-color: var(--oryx-color-brand-light);"
      ></oryx-icon>
      <oryx-icon
        type=${props.type}
        style="color: var(--oryx-color-brand-darker);background-color: var(--oryx-color-brand-lighter);"
      ></oryx-icon>
    </div>

    <h1>Custom color</h1>
    <div class="icon-set">
      <oryx-icon type=${props.type} style="color: ${props.color}"></oryx-icon>
    </div>

    <style>
      :root {
        --oryx-icon-size: 50px;
      }
      div.icon-set {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        width: 500px;
        padding-bottom: 10px;
      }
    </style>
  `;
};

export const IconColors = Template.bind({});

IconColors.argTypes = {
  type: {
    options: Object.values(IconTypes),
    control: { type: 'select' },
    defaultValue: 'desktop',
  },
  color: {
    control: { type: 'color' },
  },
};
