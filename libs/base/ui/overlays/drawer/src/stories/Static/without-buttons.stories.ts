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
    <oryx-drawer open not-resizable not-closable>
      <div style="padding:20px">Without controls</div>
    </oryx-drawer>
  `;
};

export const WithoutButtons = Template.bind({});
