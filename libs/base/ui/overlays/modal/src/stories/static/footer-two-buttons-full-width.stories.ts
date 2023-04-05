import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { OverlaysDecorator } from '../../../../../src/utilities';

export default {
  title: `${storybookPrefix}/Overlays/Modal/Static`,
  decorators: [OverlaysDecorator()],
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-modal open enableFooter footerButtonFullWidth>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
      <oryx-button slot="footer">
        <button>Save</button>
      </oryx-button>
      <oryx-button slot="footer">
        <button>Edit</button>
      </oryx-button>
    </oryx-modal>
  `;
};

export const FooterTwoButtonsFullWidth = Template.bind({});
