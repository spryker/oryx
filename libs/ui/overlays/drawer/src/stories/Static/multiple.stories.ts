import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { DrawerType } from '../..';
import { storybookPrefix } from '../../../../../.constants';
import { Position } from '../../../../../utilities/model/common';
import { OverlaysDecorator } from '../../../../../utilities/storybook';
import '../../index';

export default {
  title: `${storybookPrefix}/Overlays/Drawer/Static`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-drawer open>
      <div style="padding:20px">Primary drawer</div>
    </oryx-drawer>

    <oryx-drawer
      position=${Position.END}
      type=${DrawerType.SECONDARY}
      open
      navAriaLabel="secondary drawer's navigation"
    >
      <div style="padding:20px">Secondary drawer</div>
    </oryx-drawer>
  `;
};

export const Multiple = Template.bind({});
