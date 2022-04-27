import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../../.storybook/constant';
import { Position } from '../../../../../../utilities/model/common';
import '../../../index';

export default {
  title: `${storybookPrefix}/Overlays/Drawer/Static/Primary`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-drawer open>
      <div style="padding:20px">First drawer</div>
    </oryx-drawer>

    <oryx-drawer position=${Position.END} open>
      <div style="padding:20px">Second drawer</div>
    </oryx-drawer>
  `;
};

export const Multiple = Template.bind({});
