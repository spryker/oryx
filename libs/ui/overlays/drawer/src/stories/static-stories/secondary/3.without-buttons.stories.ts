import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { DrawerType } from '../../..';
import { storybookPrefix } from '../../../../../../.storybook/constant';
import '../../../index';

export default {
  title: `${storybookPrefix}/Overlays/Drawer/Static/Secondary`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-drawer type=${DrawerType.SECONDARY} open not-resizable not-closable>
      <div style="padding:20px">Without controls</div>
    </oryx-drawer>
  `;
};

export const WithoutButtons = Template.bind({});
