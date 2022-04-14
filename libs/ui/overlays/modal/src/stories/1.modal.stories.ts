import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.storybook/constant';
import '../index';

export default { title: `${storybookPrefix}/Overlays/Modal/Static` } as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-modal open disableCloseOnEscape disableCloseOnBackdrop header="Title">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua
      </p>
    </oryx-modal>
  `;
};

export const Modal = Template.bind({});
