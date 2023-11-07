import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Layout/Static/Features`,
  args: {},
  argTypes: {},
  chromatic: {
    delay: 1000,
  },
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h2>Divided flex items (horizontal)</h2>
    <oryx-layout layout="flex" layout-divider>
      <div>a</div>
      <div>b</div>
      <div>c</div>
    </oryx-layout>

    <h2>Divided flex items (vertical)</h2>
    <oryx-layout layout="flex" layout-divider layout-vertical>
      <div>a</div>
      <div>b</div>
      <div>c</div>
    </oryx-layout>

    <h2>Divided grid items</h2>
    <oryx-layout layout="grid" layout-divider>
      <div>a</div>
      <div>b</div>
      <div>c</div>
    </oryx-layout>

    <h2>Divided carousel items</h2>
    <oryx-layout layout="carousel" layout-divider>
      <div>a</div>
      <div>b</div>
      <div>c</div>
    </oryx-layout>

    <h2>Custom divider (color, width)</h2>
    <oryx-layout
      layout="flex"
      layout-divider
      style="--oryx-color-divider:red;--oryx-divider-width: 3px;"
    >
      <div>a</div>
      <div>b</div>
      <div>c</div>
    </oryx-layout>
  `;
};

export const Divider = Template.bind({});
