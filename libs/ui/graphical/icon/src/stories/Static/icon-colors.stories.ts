import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../.constants';
import '../../index';

export default { title: `${storybookPrefix}/graphical/Icon/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h1>Inherited current colors</h1>
    <div class="icon-set" style="color: red;">
      <oryx-icon type="desktop"></oryx-icon>
      <oryx-icon type="desktop"></oryx-icon>
      <oryx-icon type="desktop"></oryx-icon>
      <oryx-icon type="desktop"></oryx-icon>
      <oryx-icon type="desktop"></oryx-icon>
    </div>

    <h1>Current color</h1>
    <div class="icon-set">
      <oryx-icon
        type="desktop"
        style="color: var(--oryx-color-brand-lighter);"
      ></oryx-icon>
      <oryx-icon
        type="desktop"
        style="color: var(--oryx-color-brand-light);"
      ></oryx-icon>
      <oryx-icon
        type="desktop"
        style="color: var(--oryx-color-brand);"
      ></oryx-icon>
      <oryx-icon
        type="desktop"
        style="color: var(--oryx-color-brand-dark);"
      ></oryx-icon>
      <oryx-icon
        type="desktop"
        style="color: var(--oryx-color-brand-darker);"
      ></oryx-icon>
    </div>

    <h1>Background color</h1>
    <div class="icon-set">
      <oryx-icon
        type="desktop"
        style="color: var(--oryx-color-brand-lighter);background-color: var(--oryx-color-brand-darker);"
      ></oryx-icon>
      <oryx-icon
        type="desktop"
        style="color: var(--oryx-color-brand-light);background-color: var(--oryx-color-brand-dark);"
      ></oryx-icon>
      <oryx-icon
        type="desktop"
        style="color: var(--oryx-color-brand);background-color: var(--oryx-color-brand-light);"
      ></oryx-icon>
      <oryx-icon
        type="desktop"
        style="color: var(--oryx-color-brand-dark);background-color: var(--oryx-color-brand-light);"
      ></oryx-icon>
      <oryx-icon
        type="desktop"
        style="color: var(--oryx-color-brand-darker);background-color: var(--oryx-color-brand-lighter);"
      ></oryx-icon>
    </div>

    <h1>Custom color</h1>
    <div class="icon-set">
      <oryx-icon type="desktop" style="color: black"></oryx-icon>
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

export const Colors = Template.bind({});
