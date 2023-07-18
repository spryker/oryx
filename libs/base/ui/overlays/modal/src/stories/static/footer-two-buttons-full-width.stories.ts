import { OverlaysDecorator } from '@/tools/storybook';
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
      enableFooter
      footerButtonFullWidth
      heading="Full width footer buttons"
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
      <oryx-button slot="footer"> Save </oryx-button>
      <oryx-button slot="footer"> Edit </oryx-button>
    </oryx-modal>
  `;
};

export const FooterTwoButtonsFullWidth = Template.bind({});
