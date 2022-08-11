import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Actions/Button/Static/Text`,
} as Meta;

interface Props {
  disabled: boolean;
}

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
    name: 'Active',
    state: 'pseudo-active',
    lightDomState: 'pseudo-active',
  },
  {
    name: 'Focused',
    state: 'pseudo-focus',
    lightDomState: 'pseudo-focus pseudo-focus-visible',
  },
  {
    name: 'Disabled',
    state: 'pseudo-disabled',
    lightDomState: 'pseudo-disabled',
  },
  {
    name: 'Loading',
    state: '',
    lightDomState: '',
  },
];

const Template: Story<Props> = (): TemplateResult => {
  return html` <h1>Text</h1>
    <div class="button-component">
      ${variations.map((variant) => {
        const isDisabled = variant.name === 'Disabled';
        const isLoading = variant.name === 'Loading';
        return html`
          <div class="variation-button">
            <p>${variant.name}</p>
            <oryx-button ?loading=${isLoading} type="text" icon>
              <button
                ?disabled=${isDisabled}
                class="${!isLoading
                  ? variant.lightDomState
                  : 'chromatic-ignore'}"
              >
                <oryx-icon type="add"></oryx-icon>
                Button
              </button>
            </oryx-button>
            <oryx-button ?loading=${isLoading} type="text" icon>
              <a
                href="/"
                ?disabled=${isDisabled}
                class="${!isLoading
                  ? variant.lightDomState
                  : 'chromatic-ignore'}"
              >
                <oryx-icon type="add"></oryx-icon>
                Link</a
              >
            </oryx-button>
          </div>
        `;
      })}

      <style>
        .variation-button {
          display: flex;
          margin-bottom: 24px;
          gap: 15px;
          align-items: center;
        }

        .variation-button p {
          width: 80px;
        }
      </style>
    </div>`;
};

export const StatesWithIcon = Template.bind({});
