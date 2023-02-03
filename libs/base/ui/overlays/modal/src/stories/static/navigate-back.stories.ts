import { OverlaysDecorator } from '@spryker-oryx/ui/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
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
      enableNavigateBack
      heading="With navigate back button"
      enableFooter
      enableCloseButtonInHeader
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
    </oryx-modal>
  `;
};

export const NavigateBack = Template.bind({});
