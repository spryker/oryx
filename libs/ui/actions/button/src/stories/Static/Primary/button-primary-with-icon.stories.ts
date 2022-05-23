import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../../.constants';
import { Size } from '../../../../../../utilities';
import '../../../index';

export default {
  title: `${storybookPrefix}/Actions/Button/Static/Primary`,
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
  const renderButton = (set: any, icon: string): TemplateResult => {
    return html` <h1>Primary with icon</h1>
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
                      type="primary"
                      size=${size}
                      icon
                    >
                      <button
                        ?disabled=${isDisabled}
                        class="${!isLoading
                          ? variant.lightDomState
                          : 'chromatic-ignore'}"
                      >
                        <oryx-icon type=${icon}></oryx-icon>
                        Button
                      </button>
                    </oryx-button>
                    <oryx-button
                      ?loading=${isLoading}
                      type="primary"
                      size=${size}
                      icon
                    >
                      <a
                        href="/"
                        ?disabled=${isDisabled}
                        class="${!isLoading
                          ? variant.lightDomState
                          : 'chromatic-ignore'}"
                      >
                        <oryx-icon type=${icon}></oryx-icon>
                        Link
                      </a>
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

  return html` ${renderButton(Size, 'add')} `;
};

export const StatesWithIcon = Template.bind({});
