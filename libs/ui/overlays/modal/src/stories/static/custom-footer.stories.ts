import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Overlays/Modal/Static` } as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-modal open disableCloseOnEscape disableCloseOnBackdrop header="Title">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
      <oryx-button slot="footer" type="primary" size="small">
        <button>Save</button>
      </oryx-button>
      <oryx-button slot="footer" type="primary" size="small">
        <button>Ok</button>
      </oryx-button>
    </oryx-modal>
  `;
};

export const CustomFooter = Template.bind({});
