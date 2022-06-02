import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../../../../actions/button';
import { OverlaysDecorator } from '../../../../../utilities/storybook';
import '../../../../popover/index';
import '../../index';
import { renderOptions } from '../utils';

export default {
  title: `${storybookPrefix}/Overlays/Dropdown/Static`,
  decorators: [OverlaysDecorator(600, 400)],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <p>Default icon</p>
    <oryx-dropdown>${renderOptions()}</oryx-dropdown>

    <p>Custom icon</p>
    <oryx-dropdown>
      <oryx-icon type="menu" slot="icon"></oryx-icon>
      ${renderOptions()}
    </oryx-dropdown>

    <p>Custom trigger</p>
    <oryx-dropdown>
      <oryx-button slot="trigger">
        <button>Menu</button>
      </oryx-button>
      ${renderOptions()}
    </oryx-dropdown>
  `;
};

export const Triggers = Template.bind({});
