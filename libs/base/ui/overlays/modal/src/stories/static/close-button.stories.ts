import {
  OverlaysDecorator,
  storybookDefaultViewports,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Overlays/Modal/Static`,
  decorators: [OverlaysDecorator()],
  parameters: {
    chromatic: {
      delay: 2000,
      viewports: [
        storybookDefaultViewports.mobile.min,
        storybookDefaultViewports.desktop.min,
      ],
    },
  },
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-modal
      open
      preventCloseByEscape
      preventCloseByBackdrop
      heading="With close button"
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

export const WithCloseButton = Template.bind({});
