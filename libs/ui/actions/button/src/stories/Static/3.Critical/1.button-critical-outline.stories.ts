import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../../.storybook/constant';
import { Size } from '../../../../../../utilities';
import '../../../index';

export default {
  title: `${storybookPrefix}/actions/Button/Static/Critical`,
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
  const renderButton = (set: any): TemplateResult => {
    return html` <h1>Critical outline</h1>
      <div class="button-component">
        ${variations.map((variant) => {
          const isDisabled = variant.name === 'Disabled';
          const isLoading = variant.name === 'Loading';
          return html`
            <div class="variation-button">
              <p>${variant.name}</p>
              ${Object.values(set).map(
                (size) =>
                  html`
                    <oryx-button
                      ?loading=${isLoading}
                      type="critical"
                      size=${size}
                      outline
                    >
                      <button
                        ?disabled=${isDisabled}
                        class="${!isLoading
                          ? variant.lightDomState
                          : 'chromatic-ignore'}"
                      >
                        Button
                      </button>
                    </oryx-button>
                    <oryx-button
                      ?loading=${isLoading}
                      type="critical"
                      size=${size}
                      outline
                    >
                      <a
                        href="/"
                        ?disabled=${isDisabled}
                        class="${!isLoading
                          ? variant.lightDomState
                          : 'chromatic-ignore'}"
                        >Link</a
                      >
                    </oryx-button>
                  `
              )}
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

  return html` ${renderButton(Size)} `;
};

export const ButtonCriticalOutline = Template.bind({});
