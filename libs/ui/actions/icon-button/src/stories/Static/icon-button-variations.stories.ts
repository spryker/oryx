import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Actions/Icon Button/Static`,
} as Meta;

const variations = [
  {
    name: 'default',
    state: '',
    lightDomState: '',
  },
  {
    name: 'hovered',
    state: 'pseudo-hover',
    lightDomState: 'pseudo-hover',
  },
  {
    name: 'focused',
    state: 'pseudo-hover pseudo-focus',
    lightDomState: 'pseudo-focus pseudo-focus-visible',
  },
  {
    name: 'active',
    state: 'pseudo-active',
    lightDomState: 'pseudo-active',
  },
  {
    name: 'disabled',
    state: '',
    lightDomState: '',
  },
];

const sizes = ['large', 'medium', 'small'];

const Template: Story = (): TemplateResult => {
  return html`
    <div class="row header">
      <div class="col variant"></div>
      <div class="col">Large</div>
      <div class="col">Medium</div>
      <div class="col">Small</div>
    </div>

    <h4>button element</h4>

    ${variations.map(({ name, state, lightDomState }) => {
      const isDisabled = name === 'disabled';

      return html`
        <div class="row">
          <div class="col variant">
            <span>${name}</span>
          </div>

          ${sizes.map(
            (size) => html`
              <div class="col">
                <oryx-icon-button size="${size}">
                  <button
                    aria-label="${name}${size}"
                    ?disabled=${isDisabled}
                    class="${state} ${lightDomState}"
                  >
                    <oryx-icon type="rocket"></oryx-icon>
                  </button>
                </oryx-icon-button>
              </div>
            `
          )}
        </div>
      `;
    })}
    <h4>span element</h4>
    ${variations.map(({ name, state, lightDomState }) => {
      const isDisabled = name === 'disabled';

      return html`
        <div class="row">
          <div class="col variant">
            <span>${name}</span>
          </div>

          ${sizes.map(
            (size) => html`
              <div class="col">
                <oryx-icon-button size="${size}">
                  <span
                    class="${state} ${lightDomState}"
                    ?disabled=${isDisabled}
                  >
                    <oryx-icon type="rocket"></oryx-icon>
                  </span>
                </oryx-icon-button>
              </div>
            `
          )}
        </div>
      `;
    })}

    <h4>With icon element</h4>
    ${variations.map(({ name, state, lightDomState }) => {
      const isDisabled = name === 'disabled';

      return html`
        <div class="row">
          <div class="col variant">
            <span>${name}</span>
          </div>

          ${sizes.map(
            (size) => html`
              <div class="col">
                <oryx-icon-button size="${size}">
                  <oryx-icon
                    class="${state} ${lightDomState}"
                    type="rocket"
                    ?disabled=${isDisabled}
                  ></oryx-icon>
                </oryx-icon-button>
              </div>
            `
          )}
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
        flex-direction: column;
        gap: 24px;
      }
      .col.variant {
        width: 100px;
        color: #71747c;
      }
      .long-text {
        width: 200px;
      }
    </style>
  `;
};

export const Variations = Template.bind({});
