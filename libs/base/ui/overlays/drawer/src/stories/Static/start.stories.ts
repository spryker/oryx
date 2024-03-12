import { OverlaysDecorator } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Overlays/Drawer/Static`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-drawer open>
      <div style="padding:20px">Position start</div>
    </oryx-drawer>
  `;
};

export const PositionStart = Template.bind({});
