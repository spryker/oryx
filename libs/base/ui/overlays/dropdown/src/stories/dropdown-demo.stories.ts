import { getAppIcons } from '@/tools/storybook';
import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../.constants';
import { Position } from '../dropdown.model';
import { renderCustomContent, renderOptions } from './utils';

export default {
  title: `${storybookPrefix}/Overlays/Dropdown`,
  // disables Chromatic's snapshotting on a story level
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

interface Props {
  content: 'options' | 'custom';
  position: Position;
  verticalAlign: boolean;
  customContent: boolean;
  icon: string;
  customTrigger: boolean;
  triggerIconSize: Size;
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

export const DropdownDemo = Template.bind({});

DropdownDemo.args = {
  position: Position.END,
  verticalAlign: false,
  content: 'options',
  customTrigger: false,
  triggerIconSize: Size.Md,
};

DropdownDemo.argTypes = {
  content: {
    options: ['options', 'custom'],
    control: { type: 'radio' },
    table: { category: 'Slots' },
  },
  icon: {
    options: getAppIcons(),
    control: { type: 'select' },
    table: { category: 'Slots' },
  },
  customTrigger: {
    control: { type: 'boolean' },
    table: { category: 'Slots' },
  },
  position: {
    control: { type: 'select' },
    options: Object.values(Position),
  },
  triggerIconSize: {
    options: [Size.Lg, Size.Md, Size.Sm],
    control: { type: 'select' },
  },
  verticalAlign: {
    control: { type: 'boolean' },
  },
};
