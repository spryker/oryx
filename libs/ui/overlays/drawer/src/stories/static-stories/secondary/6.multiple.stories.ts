import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { DrawerType } from '../../..';
import { storybookPrefix } from '../../../../../../.storybook/constant';
import { Position } from '../../../../../../utilities/model/common';
import '../../../index';

export default {
  title: `${storybookPrefix}/Overlays/Drawer/Static/Secondary`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-drawer type=${DrawerType.SECONDARY} open>
      <div style="padding:20px">First drawer</div>
    </oryx-drawer>

    <oryx-drawer
      type=${DrawerType.SECONDARY}
      position=${Position.END}
      open
      navAriaLabel="second drawer's navigation"
    >
      <div style="padding:20px">Second drawer</div>
    </oryx-drawer>
  `;
};

export const Multiple = Template.bind({});
