import { OverlaysDecorator } from '@/tools/storybook';
import { ButtonColor, ButtonSize } from '@spryker-oryx/ui/button';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Overlays/Modal/Static`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-modal
      open
      preventCloseByEscape
      preventCloseByBackdrop
      heading="Custom footer"
      enableFooter
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
      <oryx-button
        slot="footer"
        .color=${ButtonColor.Primary}
        .size=${ButtonSize.Sm}
      >
        Save
      </oryx-button>
      <oryx-button
        slot="footer"
        .color=${ButtonColor.Primary}
        .size=${ButtonSize.Sm}
      >
        Ok
      </oryx-button>
    </oryx-modal>
  `;
};

export const CustomFooter = Template.bind({});
