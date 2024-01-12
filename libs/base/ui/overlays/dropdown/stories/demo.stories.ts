import { getAppIcons } from '@/tools/storybook';
import { Size } from '@spryker-oryx/utilities';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../.constants';
import { DropdownProperties, Position } from '../dropdown.model';
import { renderCustomContent, renderOptions } from './utils';

export default {
  title: `${storybookPrefix}/Overlays/Dropdown`,
  args: {
    position: Position.END,
    verticalAlign: false,
    triggerIconSize: Size.Md,
    content: 'options',
    customTrigger: false,
    openOnHover: false,
  },
  argTypes: {
    position: {
      control: { type: 'select' },
      options: Object.values(Position),
    },
    verticalAlign: {
      control: { type: 'boolean' },
    },
    triggerIconSize: {
      options: [Size.Lg, Size.Md, Size.Sm],
      control: { type: 'select' },
    },
    content: {
      options: ['options', 'custom'],
      control: { type: 'radio' },
      table: { category: 'Demo' },
    },
    icon: {
      options: getAppIcons(),
      control: { type: 'select' },
      table: { category: 'Demo' },
    },
    customTrigger: {
      control: { type: 'boolean' },
      table: { category: 'Demo' },
    },
  },
  parameters: { chromatic: { disableSnapshot: true } },
};

interface Props extends DropdownProperties {
  content: 'options' | 'custom';
  icon: string;
  customTrigger: boolean;
}

const Template: Story<Props> = (props: Props): TemplateResult => {
  const isOptions = props.content !== 'custom';

  setTimeout(() => {
    document.querySelector('oryx-dropdown')?.scrollIntoView({
      block: 'center',
      inline: 'center',
    });
  }, 0);

  return html`
    <style>
      .container {
        display: flex;
        width: calc(200vw - 100px);
        height: calc(200vh - 100px);
      }

      .wrapper {
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      oryx-dropdown {
        margin: 20px 0;
        --oryx-popover-maxheight: 240px;
      }
    </style>

    <div class="container">
      <div class="wrapper">
        <button>focusable before</button>

        <oryx-dropdown
          position=${props.position}
          ?vertical-align=${props.verticalAlign}
          ?openOnHover=${props.openOnHover}
          triggerIconSize=${props.triggerIconSize}
          @oryx.close=${(): void => console.log('close')}
        >
          ${when(
            props.icon,
            () => html`<oryx-icon .type=${props.icon} slot="icon"></oryx-icon>`
          )}
          ${when(
            props.customTrigger,
            () => html` <oryx-button slot="trigger">trigger</oryx-button>`
          )}
          ${when(isOptions, renderOptions, renderCustomContent)}
        </oryx-dropdown>

        <button>focusable after</button>
      </div>
    </div>
  `;
};

export const Demo = Template.bind({});
