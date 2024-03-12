import { getAppIcons } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
export default { title: `${storybookPrefix}/Graphical/Icon/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const icon = getAppIcons()[0];

  return html`
    <h1>Inherited current colors</h1>
    <div class="icon-set" style="color: red;">
      <oryx-icon .type=${icon}></oryx-icon>
      <oryx-icon .type=${icon}></oryx-icon>
      <oryx-icon .type=${icon}></oryx-icon>
      <oryx-icon .type=${icon}></oryx-icon>
      <oryx-icon .type=${icon}></oryx-icon>
    </div>

    <h1>Current color</h1>
    <div class="icon-set">
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-3);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-7);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-9);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-10);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-12);"
      ></oryx-icon>
    </div>

    <h1>Background color</h1>
    <div class="icon-set">
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-3);background-color: var(--oryx-color-primary-12);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-7);background-color: var(--oryx-color-primary-10);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-9);background-color: var(--oryx-color-primary-7);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-10);background-color: var(--oryx-color-primary-7);"
      ></oryx-icon>
      <oryx-icon
        type=${icon}
        style="color: var(--oryx-color-primary-12);background-color: var(--oryx-color-primary-3);"
      ></oryx-icon>
    </div>

    <h1>Custom color</h1>
    <div class="icon-set">
      <oryx-icon .type=${icon} style="color: black"></oryx-icon>
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
