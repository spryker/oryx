import { html, TemplateResult } from 'lit-html';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { Size } from '../../../../../src/utilities';

export const buttonTypes = (
  variations: { name: string; lightDom?: string }[],
  type?: string
): TemplateResult => {
  return html`
    ${variations.map((variant) => {
      const lightDom = variant.lightDom;
      const action: any = variant.name.toLowerCase();

      return html`
        <h3>${variant.name}</h3>
        <section class="grid">
          ${createOryxButton({ type, lightDom, action })}
          ${createOryxButton({ type, lightDom, outline: true, action })}
        </section>
      `;
    })}

    <h3>Sizes</h3>
    <section class="sizes">
      <oryx-button .type=${type} size="large" style="width:100%">
        <button>large button (100%)</button>
      </oryx-button>

      <oryx-button .type=${type} size="medium" style="width:50%">
        <a>medium sized link (50%)</a>
      </oryx-button>

      <oryx-button .type=${type} size="medium" outline style="width:400px">
        <button>
          <oryx-icon type="rocket"></oryx-icon>
          medium outline button (400px)
        </button>
      </oryx-button>

      <oryx-button .type=${type} size="small" style="width:33%">
        <button disabled>
          <oryx-icon type="rocket"></oryx-icon>small disabled (33%)
        </button>
      </oryx-button>

      <oryx-button .type=${type} size="small" loading style="flex:auto">
        <button>loading</button>
      </oryx-button>
    </section>

    <style>
      section.grid {
        display: grid;
        grid-template-columns: repeat(6, max-content);
        gap: 10px;
        align-items: center;
      }
      section.sizes {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: space-between;
      }
    </style>
  `;
};

const createOryxButton = (variant: {
  type?: string;
  outline?: boolean;
  action?: 'loading' | 'confirmed' | 'disabled';
  lightDom?: string;
}): TemplateResult => {
  const action = variant.action;
  const lightDom = variant.lightDom;
  const withIcon = true;
  const type = variant.type;

  return html`
    ${[Size.large, Size.medium, Size.small].map(
      (size) => html`
        <oryx-button
          .type=${type}
          .size=${size}
          ?loading=${variant.action === 'loading'}
          ?confirmed=${variant.action === 'confirmed'}
          ?outline=${variant.outline}
        >
          ${createButtonControl({ action, lightDom })}
        </oryx-button>
        <oryx-button
          .type=${type}
          .size=${size}
          ?loading=${variant.action === 'loading'}
          ?confirmed=${variant.action === 'confirmed'}
          ?outline=${variant.outline}
        >
          ${createButtonControl({ link: true, action, lightDom })}
        </oryx-button>
      `
    )}
    ${[Size.large, Size.medium, Size.small].map(
      (size) => html`
        <oryx-button
          .type=${type}
          .size=${size}
          ?loading=${variant.action === 'loading'}
          ?confirmed=${variant.action === 'confirmed'}
          ?outline=${variant.outline}
        >
          ${createButtonControl({ action, lightDom, withIcon })}
        </oryx-button>
        <oryx-button
          .type=${type}
          .size=${size}
          ?loading=${variant.action === 'loading'}
          ?confirmed=${variant.action === 'confirmed'}
          ?outline=${variant.outline}
        >
          ${createButtonControl({ action, lightDom, link: true, withIcon })}
        </oryx-button>
      `
    )}
  `;
};

const createButtonControl = (
  variant: {
    link?: boolean;
    withIcon?: boolean;
    outline?: boolean;
    action?: 'loading' | 'disabled' | 'confirmed';
    lightDom?: string;
  } = { lightDom: '' }
): TemplateResult => {
  return variant.link
    ? html` <a
        href="/"
        ?disabled=${variant.action === 'disabled'}
        class="${ifDefined(
          variant.action !== 'loading' ? variant.lightDom : 'chromatic-ignore'
        )}"
      >
        ${when(
          variant.withIcon,
          () => html`<oryx-icon type="rocket"></oryx-icon>`
        )}
        Link</a
      >`
    : html`
      <button
        ?disabled=${variant.action === 'disabled'}
        class="${ifDefined(
          variant.action !== 'loading' ? variant.lightDom : 'chromatic-ignore'
        )}"
      >
        ${when(
          variant.withIcon,
          () => html`<oryx-icon type="rocket"></oryx-icon>`
        )}
        Button
      </button>
    </oryx-button>`;
};
