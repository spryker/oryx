import { getAppIcons } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Graphical/Icon/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const icon = getAppIcons()[0];

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
        style="color: var(--oryx-color-primary-100);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-200);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-300);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-400);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-500);"
      ></oryx-icon>
    </div>

    <h1>Background color</h1>
    <div class="icon-set">
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-100);background-color: var(--oryx-color-primary-500);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-200);background-color: var(--oryx-color-primary-400);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-300);background-color: var(--oryx-color-primary-200);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-400);background-color: var(--oryx-color-primary-200);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-500);background-color: var(--oryx-color-primary-100);"
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
