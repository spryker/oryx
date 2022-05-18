import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../index';

export default {
  title: `${storybookPrefix}/Form/Checkbox/Static`,
} as Meta;

const headings = ['Unchecked', 'Intermediate', 'Checked'];

const variations = [
  {
    name: 'default',
    state: '',
    lightDomState: '',
  },
  {
    name: 'hovered',
    state: 'pseudo-hover',
    lightDomState: '',
  },
  {
    name: 'focused',
    state: 'pseudo-focus',
    lightDomState: 'pseudo-focus pseudo-focus-visible',
  },
  {
    name: 'disabled',
    state: '',
    lightDomState: '',
  },
  {
    name: 'error',
    state: '',
    lightDomState: '',
  },
  {
    name: 'error-message',
    state: '',
    lightDomState: '',
  },
];

const Template: Story = (): TemplateResult => {
  return html`
    <div class="row">
      <div class="col variant">
        <span />
      </div>
      ${headings.map((heading) => html`<div class="col">${heading}</div>`)}
    </div>
    ${variations.map((variant) => {
      const isErrorMessage = variant.name === 'error-message';
      const isDisabled = variant.name === 'disabled';
      const isError = variant.name === 'error' || isErrorMessage;

      const errorMessage = isErrorMessage
        ? html`
            <oryx-error-message
              slot="error"
              message="Error validation text"
              style="margin-top:0px;"
            >
            </oryx-error-message>
          `
        : html``;

      const renderCheckbox = ({
        checked = false,
        intermediate = false,
      }): TemplateResult => html`
        <oryx-checkbox ?intermediate=${intermediate} ?error=${isError}>
          <input
            type="checkbox"
            defaultValue="false"
            ?checked=${checked}
            @click=${(e: Event): void => e.preventDefault()}
            class="${variant.lightDomState}"
            ?disabled=${isDisabled}
          />
          Option ${errorMessage}
        </oryx-checkbox>
      `;

      return html`
        <div class="row">
          <div class="col variant">
            <span>${variant.name}</span>
          </div>
          <div class="col ${variant.state}">${renderCheckbox({})}</div>
          <div class="col ${variant.state}">
            ${renderCheckbox({ checked: true, intermediate: true })}
          </div>
          <div class="col ${variant.state}">
            ${renderCheckbox({ checked: true })}
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
        flex-direction: column;
        gap: 24px;
        width: 180px;
      }
      .col.variant {
        width: 100px;
        color: #71747c;
      }
    </style>
  `;
};

export const VisualVariations = Template.bind({});
