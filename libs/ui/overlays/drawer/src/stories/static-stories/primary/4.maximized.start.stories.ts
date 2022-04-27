import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../../.storybook/constant';
import '../../../index';

export default {
  title: `${storybookPrefix}/Overlays/Drawer/Static/Primary`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-drawer open maximize>
      <div style="padding:20px">Default maximized</div>
    </oryx-drawer>
  `;
};

export const MaximizedStart = Template.bind({});
