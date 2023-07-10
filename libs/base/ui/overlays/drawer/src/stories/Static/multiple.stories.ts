import { OverlaysDecorator } from '@/tools/storybook';
import { Position } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { DrawerType } from '../../index';

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
