import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { Position } from '../../../../../utilities';
import { OverlaysDecorator } from '../../../../../utilities/storybook';
import '../../../../popover/index';
import '../../index';
import { renderOptions } from '../utils';

const dropdownMaxHeight = 200;
const gap = 0;

export default {
  title: `${storybookPrefix}/Overlays/Dropdown/Static`,
  decorators: [OverlaysDecorator(600, 400)],
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <style>
      .container {
        padding: ${gap}px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: calc(100vw - ${gap * 2}px - 2rem);
        min-height: calc(100vh - ${gap * 2}px - 2rem);
      }

      .container > div {
        display: flex;
        justify-content: space-between;
        height: ${dropdownMaxHeight}px;
      }

      .container > div:last-child {
        align-items: flex-end;
      }

      oryx-dropdown {
        --oryx-popover-maxheight: ${dropdownMaxHeight}px;
      }
    </style>

    <div class="container">
      ${Array.from(new Array(2).keys()).map(
        () => html`
          <div>
            ${[Position.START, Position.END].map(
              (position) => html`
                <oryx-dropdown position=${position} open>
                  ${renderOptions()}
                </oryx-dropdown>
              `
            )}
          </div>
        `
      )}
    </div>
  `;
};

export const DifferentPositions = Template.bind({});
