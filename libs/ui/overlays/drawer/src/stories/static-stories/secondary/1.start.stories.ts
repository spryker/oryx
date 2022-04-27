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
    <oryx-drawer type=${DrawerType.SECONDARY} open>
      <div style="padding:20px">Position start</div>
    </oryx-drawer>
  `;
};

export const PositionStart = Template.bind({});
