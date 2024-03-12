import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Structure/Tile/Static`,
} as Meta;

const variations = [
  {
    name: 'Default',
    state: '',
    lightDomState: '',
  },
  {
    name: 'Hovered',
    state: 'pseudo-hover',
    lightDomState: 'pseudo-hover',
  },
  {
    name: 'Focus',
    state: 'pseudo-focus-visible',
    lightDomState: 'pseudo-focus-visible',
  },
];

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Selected</h1>
    <div class="tile-component">
      ${variations.map((variant) => {
        return html`
          <div class="variation-tile">
            <p>${variant.name}</p>
            <oryx-tile selected>
              <a href="/" class="${variant.lightDomState}">Tile</a>
            </oryx-tile>
          </div>
        `;
      })}
      <style>
        .variation-tile {
          display: flex;
          margin-bottom: 20px;
          gap: 20px;
          align-items: center;
        }

        .variation-tile oryx-tile {
          width: 100%;
        }

        .variation-tile p {
          width: 100px;
        }
      </style>
    </div>
  `;
};

export const StatesSelected = Template.bind({});
