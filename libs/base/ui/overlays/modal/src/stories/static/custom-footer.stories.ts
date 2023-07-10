import { OverlaysDecorator } from '@/tools/storybook';
import { Size } from '@spryker-oryx/utilities';
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
      heading="Custom footer"
      enableFooter
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
      <oryx-button slot="footer" type="primary" size=${Size.Sm}>
        <button>Save</button>
      </oryx-button>
      <oryx-button slot="footer" type="primary" size=${Size.Sm}>
        <button>Ok</button>
      </oryx-button>
    </oryx-modal>
  `;
};

export const CustomFooter = Template.bind({});
