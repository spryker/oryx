import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../.constants';

export default { title: `${storybookPrefix}/Form/Radio/Static` } as Meta;

const variations = [
  { label: 'default' },
  { label: 'error message', errorMessage: 'Error message' },
  { label: 'custom error message', hasError: true, customError: true },
  { label: 'error state', hasError: true },
];
const states = [
  { state: 'default' },
  { state: 'hover' },
  { label: 'focus', state: 'focus-visible' },
  { state: 'disabled' },
];

const Template: Story = (): TemplateResult =>
  html`
    <section>
      ${variations.map(
        (group, index) => html` <h3>${group.label}</h3>
          ${states.map(
            (variant) => html`
              <h4>${variant.label ?? variant.state}</h4>
              <oryx-radio
                ?hasError=${group.hasError}
                .errorMessage=${group.errorMessage}
              >
                <input
                  type="radio"
                  name=${`${index}-${variant.state}`}
                  class="pseudo-${variant.state}"
                  ?disabled=${variant.state === 'disabled'}
                />
                Option
                ${when(
                  group.customError,
                  () => html`<span slot="error">Custom error message</span>`
                )}
              </oryx-radio>
              <oryx-radio
                ?hasError=${group.hasError}
                .errorMessage=${group.errorMessage}
              >
                <input
                  type="radio"
                  name=${`${index}-${variant.state}`}
                  checked
                  class="pseudo-${variant.state}"
                  ?disabled=${variant.state === 'disabled'}
                />
                Option
                ${when(
                  group.customError,
                  () => html`<span slot="error">Custom error message</span>`
                )}
              </oryx-radio>
              <oryx-radio
                ?hasError=${group.hasError}
                .errorMessage=${group.errorMessage}
              >
                <input
                  type="radio"
                  name=${`${index}-${variant.state}`}
                  class="pseudo-${variant.state}"
                  ?disabled=${variant.state === 'disabled'}
                />
                Option
                ${when(
                  group.customError,
                  () => html`<span slot="error">Custom error message</span>`
                )}
                <small slot="subtext">subtext</small>
              </oryx-radio>
            `
          )}`
      )}
    </section>

    <style>
      section {
        display: grid;
        grid-template-columns: repeat(4, max-content);
        align-items: flex-start;
        gap: 10px;
      }

      section h3 {
        text-transform: capitalize;
        grid-column: 1 / span 4;
      }

      section h4 {
        text-transform: capitalize;
        margin: 0;
      }
    </style>
  `;
export const States = Template.bind({});
