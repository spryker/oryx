import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../.constants';
import { OverlaysDecorator } from '../../../../../utilities/storybook';

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
