import { AppRef, ThemePlugin } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Graphical/Icon/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const icon = Object.keys(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resolve(AppRef).findPlugin(ThemePlugin)!.getIconsList()
  )[0];

  return html`
    <h1>Inherited current colors</h1>
    <div class="icon-set" style="color: red;">
      <oryx-icon type=${icon}></oryx-icon>
      <oryx-icon type=${icon}></oryx-icon>
      <oryx-icon type=${icon}></oryx-icon>
      <oryx-icon type=${icon}></oryx-icon>
      <oryx-icon type=${icon}></oryx-icon>
    </div>

    <h1>Current color</h1>
    <div class="icon-set">
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-brand-lighter);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-brand-light);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-brand);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-brand-dark);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-brand-darker);"
      ></oryx-icon>
    </div>

    <h1>Background color</h1>
    <div class="icon-set">
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-brand-lighter);background-color: var(--oryx-color-brand-darker);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-brand-light);background-color: var(--oryx-color-brand-dark);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-brand);background-color: var(--oryx-color-brand-light);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-brand-dark);background-color: var(--oryx-color-brand-light);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-brand-darker);background-color: var(--oryx-color-brand-lighter);"
      ></oryx-icon>
    </div>

    <h1>Custom color</h1>
    <div class="icon-set">
      <oryx-icon type=${icon} style="color: black"></oryx-icon>
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
