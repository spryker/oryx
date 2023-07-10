import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const lengthyText = `Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew`;

export const Template: Story = (): TemplateResult => {
  return html`
    <h1>Light DOM</h1>

    <h2>Line clamping</h2>
    <div class="clamped">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return [3, 2, 1].map((line) => {
          const el = unsafeHTML(`<${tag}>${tag} ${lengthyText}</${tag}>`);
          return html`<oryx-heading maxLines=${line}> ${el} </oryx-heading>`;
        });
      })}
      ${[3, 2, 1].map(
        (line) => html`
          <oryx-heading maxLines=${line}>
            <span class="caption">${lengthyText}</span>
          </oryx-heading>
        `
      )}
      ${[3, 2, 1].map(
        (line) => html`
          <oryx-heading maxLines=${line}>
            <b class="subtitle">${lengthyText}</b>
          </oryx-heading>
        `
      )}
    </div>

    <h3>Hidden utility</h3>
    <oryx-heading as-lg="hide"><h1>hidden on large screen</h1></oryx-heading>
    <oryx-heading as-md="hide"><h1>hidden on medium screen</h1></oryx-heading>
    <oryx-heading as-sm="hide"><h1>hidden on small screen</h1></oryx-heading>
    <oryx-heading as="hide"><h1>hidden on all</h1></oryx-heading>
    <oryx-heading as="hide" as-lg="show">
      <h1>hidden on all, but large screen</h1>
    </oryx-heading>
    <oryx-heading as="hide" as-lg="h3">
      <h1>hidden on all, but h3 on large screen</h1>
    </oryx-heading>
    <oryx-heading as="hide" as-md="show">
      <h1>hidden on all, but medium screen</h1>
    </oryx-heading>
    <oryx-heading as="hide" as-md="h3">
      <h1>hidden on all, but h3 on medium screen</h1>
    </oryx-heading>
    <oryx-heading as="hide" as-sm="show">
      <h1>hidden on all, but small screen</h1>
    </oryx-heading>
    <oryx-heading as="hide" as-sm="h3">
      <h1>hidden on all, but h3 on small screen</h1>
    </oryx-heading>

    <h3>"as"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        const el = unsafeHTML(`<${tag}>${tag}</${tag}>`);
        return html`
          <oryx-heading as="h1">${el}</oryx-heading>
          <oryx-heading as="h2">${el}</oryx-heading>
          <oryx-heading as="h3">${el}</oryx-heading>
          <oryx-heading as="h4">${el}</oryx-heading>
          <oryx-heading as="h5">${el}</oryx-heading>
          <oryx-heading as="h6">${el}</oryx-heading>
        `;
      })}
    </div>

    <h2>Large screen</h2>
    <h3>"as-lg"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        const el = unsafeHTML(`<${tag}>${tag}</${tag}>`);
        return html`
          <oryx-heading as-lg="h1">${el}</oryx-heading>
          <oryx-heading as-lg="h2">${el}</oryx-heading>
          <oryx-heading as-lg="h3">${el}</oryx-heading>
          <oryx-heading as-lg="h4">${el}</oryx-heading>
          <oryx-heading as-lg="h5">${el}</oryx-heading>
          <oryx-heading as-lg="h6">${el}</oryx-heading>
        `;
      })}
    </div>

    <h2>Medium screens</h2>
    <h3>"as-md"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        const el = unsafeHTML(`<${tag}>${tag}</${tag}>`);
        return html`
          <oryx-heading as-md="h1">${el}</oryx-heading>
          <oryx-heading as-md="h2">${el}</oryx-heading>
          <oryx-heading as-md="h3">${el}</oryx-heading>
          <oryx-heading as-md="h4">${el}</oryx-heading>
          <oryx-heading as-md="h5">${el}</oryx-heading>
          <oryx-heading as-md="h6">${el}</oryx-heading>
        `;
      })}
    </div>

    <h2>Small screen</h2>
    <h3>"as-sm"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        const el = unsafeHTML(`<${tag}>${tag}</${tag}>`);
        return html`
          <oryx-heading as-sm="h1">${el}</oryx-heading>
          <oryx-heading as-sm="h2">${el}</oryx-heading>
          <oryx-heading as-sm="h3">${el}</oryx-heading>
          <oryx-heading as-sm="h4">${el}</oryx-heading>
          <oryx-heading as-sm="h5">${el}</oryx-heading>
          <oryx-heading as-sm="h6">${el}</oryx-heading>
        `;
      })}
    </div>

    <h2>Colorful</h2>
    ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
      const el = unsafeHTML(`<${tag}>Grumpy wizards make toxic brew.
      <span class="colorful">Grumpy wizards</span> make toxic brew</${tag}>`);
      return html`<oryx-heading>${el}</oryx-heading>`;
    })}
    <oryx-heading>
      <span class="caption">
        Grumpy wizards make toxic brew.
        <span class="colorful">Grumpy wizards</span> make toxic brew
      </span>
    </oryx-heading>

    <oryx-heading>
      <span class="subtitle">
        Grumpy wizards make toxic brew.
        <span class="colorful">Grumpy wizards</span> make toxic brew
      </span>
    </oryx-heading>

    <h1>Shadow DOM</h1>

    <h2>Line clamping</h2>
    <div class="clamped">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'caption', 'subtitle'].map(
        (tag) => {
          return [3, 2, 1].map((line) => {
            return html`<oryx-heading tag=${tag} maxLines=${line}
              >${lengthyText}</oryx-heading
            >`;
          });
        }
      )}
    </div>

    <h3>Hidden utility</h3>
    <oryx-heading tag="h1" as-lg="hide">hidden on large screen</oryx-heading>
    <oryx-heading tag="h1" as-md="hide">hidden on medium screen</oryx-heading>
    <oryx-heading tag="h1" as-sm="hide">hidden on small screen</oryx-heading>
    <oryx-heading tag="h1" as="hide">hidden on all</oryx-heading>
    <oryx-heading tag="h1" as="hide" as-lg="show">
      hidden on all, but large screen
    </oryx-heading>
    <oryx-heading tag="h1" as="hide" as-lg="h3">
      hidden on all, but h3 on large screen
    </oryx-heading>
    <oryx-heading tag="h1" as="hide" as-md="show">
      hidden on all, but medium screen
    </oryx-heading>
    <oryx-heading tag="h1" as="hide" as-md="h3">
      hidden on all, but h3 on medium screen
    </oryx-heading>
    <oryx-heading tag="h1" as="hide" as-sm="show">
      hidden on all, but small screen
    </oryx-heading>
    <oryx-heading tag="h1" as="hide" as-sm="h3">
      hidden on all, but h3 on small screen
    </oryx-heading>

    <h2>"as"</h2>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) =>
          html`
            <oryx-heading tag=${tag} as="h1">${tag}</oryx-heading>
            <oryx-heading tag=${tag} as="h2">${tag}</oryx-heading>
            <oryx-heading tag=${tag} as="h3">${tag}</oryx-heading>
            <oryx-heading tag=${tag} as="h4">${tag}</oryx-heading>
            <oryx-heading tag=${tag} as="h5">${tag}</oryx-heading>
            <oryx-heading tag=${tag} as="h6">${tag}</oryx-heading>
          `
      )}
    </div>

    <h2>Large screen</h2>
    <h3>"as-lg"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return html`
          <oryx-heading tag=${tag} as-lg="h1">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-lg="h2">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-lg="h3">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-lg="h4">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-lg="h5">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-lg="h6">${tag}</oryx-heading>
        `;
      })}
    </div>

    <h2>Medium screen</h2>
    <h3>"as-md"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return html`
          <oryx-heading tag=${tag} as-md="h1">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-md="h2">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-md="h3">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-md="h4">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-md="h5">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-md="h6">${tag}</oryx-heading>
        `;
      })}
    </div>

    <h2>Small screen</h2>
    <h3>"as-sm"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return html`
          <oryx-heading tag=${tag} as-sm="h1">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-sm="h2">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-sm="h3">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-sm="h4">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-sm="h5">${tag}</oryx-heading>
          <oryx-heading tag=${tag} as-sm="h6">${tag}</oryx-heading>
        `;
      })}
    </div>

    <h2>Colorful</h2>
    ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'caption', 'subtitle'].map(
      (tag) => html` <oryx-heading tag=${tag}>
        Grumpy wizards make toxic brew.
        <span class="colorful">Grumpy wizards</span> make toxic brew
      </oryx-heading>`
    )}

    <style>
      .clamped {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-flow: row;
        gap: 30px;
      }

      .clamped oryx-heading {
        display: flex;
        align-items: start;
      }

      .as {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-auto-flow: row;
      }

      .colorful {
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(
          45deg,
          var(--oryx-color-secondary-9),
          var(--oryx-color-primary-9)
        );
      }
    </style>
  `;
};
