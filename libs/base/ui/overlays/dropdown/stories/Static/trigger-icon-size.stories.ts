import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Overlays/Dropdown/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h4>Trigger Icon Size</h4>
    ${[Size.Lg, Size.Md, Size.Sm].map(
      (size) => html`<oryx-dropdown triggerIconSize=${size}></oryx-dropdown>`
    )}

    <h4>Custom icon (custom size and margin)</h4>
    <oryx-dropdown>
      <oryx-button
        slot="trigger"
        .size=${ButtonSize.Md}
        .type=${ButtonType.Icon}
        .icon=${IconTypes.Actions}
        style="margin:10px;"
      ></oryx-button>
    </oryx-dropdown>
    <oryx-dropdown>
      <oryx-button
        slot="trigger"
        style="--oryx-button-size-factor: 4;margin:10px;"
        .type=${ButtonType.Icon}
        .icon=${IconTypes.Actions}
      ></oryx-button>
    </oryx-dropdown>
    <oryx-dropdown>
      <oryx-button
        slot="trigger"
        style="--oryx-button-size-factor: 11;margin:10px;"
        .type=${ButtonType.Icon}
        .icon=${IconTypes.Actions}
      ></oryx-button
    ></oryx-dropdown>
  `;
};

export const TriggerIconSize = Template.bind({});
