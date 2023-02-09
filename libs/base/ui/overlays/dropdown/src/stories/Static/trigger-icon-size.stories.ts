import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { Size } from '../../../../../src/utilities';

export default {
  title: `${storybookPrefix}/Overlays/Dropdown/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h4>Trigger Icon Size</h4>
    ${Object.values(Size).map(
      (size) => html`<oryx-dropdown triggerIconSize=${size}></oryx-dropdown>`
    )}

    <h4>Icon size</h4>

    ${Object.values(Size).map(
      (size) => html`<oryx-dropdown>
        <oryx-icon slot="icon" type="actions" size=${size}></oryx-icon>
      </oryx-dropdown>`
    )}

    <h4>Custom icon (custom size and margin)</h4>
    <oryx-dropdown>
      <oryx-icon
        slot="icon"
        type="actions"
        style="--oryx-icon-size: 20px;margin:10px;"
      ></oryx-icon>
    </oryx-dropdown>
    <oryx-dropdown>
      <oryx-icon
        slot="icon"
        type="actions"
        style="--oryx-icon-size: 40px;margin:20px;"
      ></oryx-icon>
    </oryx-dropdown>
    <oryx-dropdown>
      <oryx-icon
        slot="icon"
        type="actions"
        style="--oryx-icon-size: 60px;margin:10px;"
      ></oryx-icon>
    </oryx-dropdown>
  `;
};

export const TriggerIconSize = Template.bind({});
