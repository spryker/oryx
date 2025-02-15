import { OverlaysDecorator } from '@/tools/storybook';
import { Position } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Overlays/Drawer/Static`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-drawer position=${Position.END} open maximize>
      <div style="padding:20px">Default maximized</div>
    </oryx-drawer>
  `;
};

export const MaximizedEnd = Template.bind({});
