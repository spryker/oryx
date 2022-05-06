import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import { ChipType } from '../../index';
export default { title: `${storybookPrefix}/Graphical/Chip/Static` } as Meta;

export interface ChipProperties {
  type?: ChipType;
}

const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim';

const variations = [
  {
    type: ChipType.ONLINE,
    color: 'Green',
  },
  {
    type: ChipType.INFO,
    color: 'Blue',
  },
  {
    type: ChipType.LOW,
    color: 'Yellow',
  },
  {
    type: ChipType.WARNING,
    color: 'Orange',
  },
  {
    type: ChipType.ERROR,
    color: 'Red',
  },
  {
    type: ChipType.OFFLINE,
    color: 'Gray',
  },
  {
    type: ChipType.INACTIVE,
    color: 'Gray lighter',
  },
];

const Template: Story = (): TemplateResult => {
  return html`
    ${variations.map((variant) => {
      return html`
        <div class="row">
          <div class="col variant">
            <span>${variant.type}</span>
          </div>
          <div class="col type">
            <oryx-chip .type=${variant.type}> ${variant.color} </oryx-chip>
          </div>
          <div class="col">
            <oryx-chip .type=${variant.type} class="long-text">
              ${longText}
            </oryx-chip>
          </div>
        </div>
      `;
    })}

    <style>
      .row {
        display: flex;
        align-items: center;
        gap: 40px;
        margin-bottom: 24px;
      }
      .col {
        display: flex;
        align-items: start;
        flex-direction: column;
        gap: 24px;
      }
      .col.variant {
        width: 100px;
        color: #71747c;
      }
      .col.type {
        width: 200px;
      }
      .long-text {
        width: 200px;
      }
    </style>
  `;
};

export const ChipVariations = Template.bind({});
