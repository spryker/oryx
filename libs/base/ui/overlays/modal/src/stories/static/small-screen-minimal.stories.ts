import {
  OverlaysDecorator,
  storybookDefaultViewports,
} from '@/tools/storybook';
import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Overlays/Modal/Static`,
  decorators: [OverlaysDecorator(414, 896)],
  parameters: {
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
    viewport: { defaultViewport: 'mobile2' },
  },
};

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-modal
      open
      minimal
      preventCloseByEscape
      preventCloseByBackdrop
      heading="Minimum modal"
      enableFooter
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
    </oryx-modal>
  `;
};

export const SmallScreenMinimumModal = Template.bind({});
