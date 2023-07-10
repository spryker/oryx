import { CardType } from '@spryker-oryx/ui/card';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Overlays/Modal`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

interface Props {
  enableNavigateBack: boolean;
  enableCloseButtonInHeader: boolean;

  firstModalMinimal?: boolean;
  secondModalMinimal?: boolean;

  firstModalHeader?: string;
  secondModalHeader?: string;

  firstModalContent?: string;
  secondModalContent?: string;

  firstModalType?: CardType;
  secondModalType?: CardType;

  firstModalPreventCloseByBackdrop?: boolean;
  secondModalPreventCloseByBackdrop?: boolean;

  firstModalPreventCloseByEscape?: boolean;
  secondModalPreventCloseByEscape?: boolean;

  firstFooterButtonFullWidth?: boolean;
  secondFooterButtonFullWidth?: boolean;
}

const generateContent = (times: number): TemplateResult => html`
  ${[...Array(times).keys()].map((i) => html` <p>${i}</p> `)}
`;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <script>
      (() => {
        const openFirstModalBtn = document.querySelector('#openFirstModalBtn');
        const openSecondModalBtn = document.querySelector(
          '#openSecondModalBtn'
        );

        const firstModal = document.querySelector('oryx-modal');
        const secondModal = document.querySelectorAll('oryx-modal')[1];

        openFirstModalBtn?.addEventListener('click', () => {
          firstModal?.open();
        });

        openSecondModalBtn?.addEventListener('click', () => {
          secondModal?.open();
        });
      })();
    </script>

    <button id="openFirstModalBtn">Open first modal</button>
    ${generateContent(20)}

    <oryx-modal
      ?enableNavigateBack=${props.enableNavigateBack}
      ?enableCloseButtonInHeader=${props.enableCloseButtonInHeader}
      ?preventCloseByEscape=${props.firstModalPreventCloseByEscape}
      ?preventCloseByBackdrop=${props.firstModalPreventCloseByBackdrop}
      ?minimal=${props.firstModalMinimal}
      ?footerButtonFullWidth=${props.firstFooterButtonFullWidth}
      heading=${props.firstModalHeader}
      type=${props.firstModalType}
      @oryx.close=${console.log}
      @oryx.back=${console.log}
      enableFooter
    >
      <div>
        <p>${props.firstModalContent}</p>
        <button id="openSecondModalBtn">Open second modal</button>

        <oryx-modal
          ?enableNavigateBack=${props.enableNavigateBack}
          ?enableCloseButtonInHeader=${props.enableCloseButtonInHeader}
          ?preventCloseByEscape=${props.secondModalPreventCloseByEscape}
          ?preventCloseByBackdrop=${props.secondModalPreventCloseByBackdrop}
          ?minimal=${props.secondModalMinimal}
          ?footerButtonFullWidth=${props.secondFooterButtonFullWidth}
          heading=${props.secondModalHeader}
          type=${props.secondModalType}
          enableFooter
        >
          ${props.secondModalContent}
        </oryx-modal>
      </div>
    </oryx-modal>
  `;
};

export const ModalDemo = Template.bind({});

ModalDemo.args = {
  enableNavigateBack: false,
  enableCloseButtonInHeader: false,
  firstModalMinimal: false,
  secondModalMinimal: false,
  firstModalPreventCloseByBackdrop: false,
  secondModalPreventCloseByBackdrop: false,
  firstModalPreventCloseByEscape: false,
  secondModalPreventCloseByEscape: false,
  firstFooterButtonFullWidth: false,
  secondFooterButtonFullWidth: false,
  firstModalHeader: 'First modal header',
  secondModalHeader: 'Second modal header',
  firstModalContent:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel pharetra lacus. Fusce interdum venenatis nulla quis euismod. Maecenas ante ante, gravida at dolor nec, efficitur finibus tellus. Sed eu erat bibendum, semper nulla quis, sagittis augue. Vestibulum mattis ullamcorper purus rutrum sollicitudin. Nunc ac elementum nisi. Suspendisse sed ligula vitae tortor placerat condimentum. Nullam pretium sit amet nisi a scelerisque. Mauris vitae dictum justo. Ut at ex gravida tellus convallis accumsan at ac nulla. Praesent scelerisque, tortor a mollis imperdiet, velit purus posuere nisi, et pretium massa eros volutpat nisi. Nullam eget auctor orci, eget dapibus ipsum. Pellentesque ante elit, egestas vitae laoreet ut, ullamcorper ac tortor. Quisque condimentum elit at est finibus pharetra.',
  secondModalContent:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
};

ModalDemo.argTypes = {
  firstModalMinimal: {
    table: { category: 'First modal' },
    control: { type: 'boolean' },
  },
  secondModalMinimal: {
    table: { category: 'Second modal' },
    control: { type: 'boolean' },
  },
  firstModalPreventCloseByBackdrop: {
    table: { category: 'First modal' },
    control: { type: 'boolean' },
  },
  secondModalPreventCloseByBackdrop: {
    table: { category: 'Second modal' },
    control: { type: 'boolean' },
  },
  firstModalPreventCloseByEscape: {
    table: { category: 'First modal' },
    control: { type: 'boolean' },
  },
  secondModalPreventCloseByEscape: {
    table: { category: 'Second modal' },
    control: { type: 'boolean' },
  },
  firstFooterButtonFullWidth: {
    table: { category: 'First modal' },
    control: { type: 'boolean' },
  },
  secondFooterButtonFullWidth: {
    table: { category: 'Second modal' },
    control: { type: 'boolean' },
  },
  firstModalHeader: {
    table: { category: 'First modal' },
    control: { type: 'text' },
  },
  secondModalHeader: {
    table: { category: 'Second modal' },
    control: { type: 'text' },
  },
  firstModalContent: {
    table: { category: 'First modal' },
    control: { type: 'text' },
  },
  secondModalContent: {
    table: { category: 'Second modal' },
    control: { type: 'text' },
  },
};

ModalDemo.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
};
