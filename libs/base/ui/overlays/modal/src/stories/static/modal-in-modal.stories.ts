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
      preventCloseByEscape
      preventCloseByBackdrop
      heading="First modal header"
      enableFooter
      enableCloseButtonInHeader
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel
        pharetra lacus. Fusce interdum venenatis nulla quis euismod. Maecenas
        ante ante, gravida at dolor nec, efficitur finibus tellus. Sed eu erat
        bibendum, semper nulla quis, sagittis augue. Vestibulum mattis
        ullamcorper purus rutrum sollicitudin. Nunc ac elementum nisi.
        Suspendisse sed ligula vitae tortor placerat condimentum. Nullam pretium
        sit amet nisi a scelerisque. Mauris vitae dictum justo. Ut at ex gravida
        tellus convallis accumsan at ac nulla. Praesent scelerisque, tortor a
        mollis imperdiet, velit purus posuere nisi, et pretium massa eros
        volutpat nisi. Nullam eget auctor orci, eget dapibus ipsum. Pellentesque
        ante elit, egestas vitae laoreet ut, ullamcorper ac tortor. Quisque
        condimentum elit at est finibus pharetra.
      </p>
      <oryx-modal
        open
        preventCloseByEscape
        preventCloseByBackdrop
        heading="Second modal header"
        enableFooter
        enableCloseButtonInHeader
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua'.
        </p>
      </oryx-modal>
    </oryx-modal>
  `;
};

export const ModalInModal = Template.bind({});
