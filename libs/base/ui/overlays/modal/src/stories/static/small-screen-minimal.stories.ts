import { OverlaysDecorator } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Overlays/Modal/Static`,
  decorators: [OverlaysDecorator()],
  parameters: {
    chromatic: { delay: 1000 },
    viewport: { defaultViewport: 'mobile2' },
  },
} as Meta;

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
