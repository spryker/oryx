import { getAppIcons } from '@/tools/storybook';
import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

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

const sizes = [Size.Lg, Size.Md, Size.Sm];

const Template: Story = (): TemplateResult => {
  const icon = getAppIcons()[0];

  return html`
    <section>
      <h4></h4>
      <h4>Large</h4>
      <h4>Medium</h4>
      <h4>Small</h4>
      <h4>Large with label</h4>
      <h4>Medium with label</h4>
      <h4>Small with label</h4>

      <h3>button element</h3>

      ${variations.map(({ name, state, lightDomState }) => {
        const isDisabled = name === 'disabled';

        return html`
          <h4>${name}</h4>

          ${sizes.map(
            (size) => html`
              <oryx-icon-button size=${size}>
                <button
                  aria-label="${name}${size}"
                  ?disabled=${isDisabled}
                  class="${state} ${lightDomState}"
                >
                  <oryx-icon .type=${icon}></oryx-icon>
                </button>
              </oryx-icon-button>
            `
          )}
          ${sizes.map(
            (size) => html`
              <oryx-icon-button size=${size}>
                <button
                  aria-label="${name}${size}"
                  ?disabled=${isDisabled}
                  class="${state} ${lightDomState}"
                >
                  <oryx-icon .type=${icon}></oryx-icon>
                </button>
                label
              </oryx-icon-button>
            `
          )}
        `;
      })}

      <h3>anchor element</h3>
      ${variations.map(({ name, state, lightDomState }) => {
        const isDisabled = name === 'disabled';

        return html`
          <h4>${name}</h4>

          ${sizes.map(
            (size) => html`
              <oryx-icon-button size=${size}>
                <a
                  class="${state} ${lightDomState}"
                  ?disabled=${isDisabled}
                  href="http://www.link.com"
                >
                  <oryx-icon .type=${icon}></oryx-icon>
                </a>
              </oryx-icon-button>
            `
          )}
          ${sizes.map(
            (size) => html`
              <oryx-icon-button size=${size}>
                <a
                  class="${state} ${lightDomState}"
                  ?disabled=${isDisabled}
                  href="http://www.link.com"
                >
                  <oryx-icon .type=${icon}></oryx-icon>
                </a>
                label
              </oryx-icon-button>
            `
          )}
        `;
      })}

      <h3>text inside element</h3>
      ${variations.map(({ name, state, lightDomState }) => {
        const isDisabled = name === 'disabled';

        return html`
          <h4>${name}</h4>

          ${sizes.map(
            (size) => html`
              <oryx-icon-button size=${size}>
                <a
                  class="${state} ${lightDomState}"
                  ?disabled=${isDisabled}
                  href="http://www.link.com"
                >
                  <oryx-icon .type=${icon}></oryx-icon>
                </a>
              </oryx-icon-button>
            `
          )}
          ${sizes.map(
            (size) => html`
              <oryx-icon-button size=${size}>
                <a
                  class="${state} ${lightDomState}"
                  ?disabled=${isDisabled}
                  href="http://www.link.com"
                >
                  <oryx-icon .type=${icon}></oryx-icon>
                </a>
                <span>label</span>
              </oryx-icon-button>
            `
          )}
        `;
      })}

      <style>
        section {
          display: grid;
          grid-template-columns: repeat(7, 100px);
          gap: 10px;
        }
        h3 {
          grid-column: 1 / span 7;
        }
      </style>
    </section>
  `;
};

export const Static = Template.bind({});
