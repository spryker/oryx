import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { Position } from '../../../../../utilities/model/common';
import { OverlaysDecorator } from '../../../../../utilities/storybook';

export default {
  title: `${storybookPrefix}/Overlays/Drawer/Static`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-drawer position=${Position.END} open>
      <div style="padding:20px">Position end</div>
    </oryx-drawer>
  `;
};

export const PositionEnd = Template.bind({});
