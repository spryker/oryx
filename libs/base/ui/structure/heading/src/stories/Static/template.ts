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

    <h2>Appearance heading</h2>
    <div class="appearance">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        const el = unsafeHTML(`<${tag}>${tag}</${tag}>`);
        return html`
          <oryx-heading>${el}</oryx-heading>
          <oryx-heading appearance="h1">${el}</oryx-heading>
          <oryx-heading appearance="h2">${el}</oryx-heading>
          <oryx-heading appearance="h3">${el}</oryx-heading>
          <oryx-heading appearance="h4">${el}</oryx-heading>
          <oryx-heading appearance="h5">${el}</oryx-heading>
          <oryx-heading appearance="h6">${el}</oryx-heading>
        `;
      })}
    </div>

    <h2>Appearance heading (medium and larger)</h2>
    <div class="appearance">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        const el = unsafeHTML(`<${tag}>${tag}</${tag}>`);
        return html`
          <oryx-heading>${el}</oryx-heading>
          <oryx-heading md-appearance="h1">${el}</oryx-heading>
          <oryx-heading md-appearance="h2">${el}</oryx-heading>
          <oryx-heading md-appearance="h3">${el}</oryx-heading>
          <oryx-heading md-appearance="h4">${el}</oryx-heading>
          <oryx-heading md-appearance="h5">${el}</oryx-heading>
          <oryx-heading md-appearance="h6">${el}</oryx-heading>
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

    <h2>Appearance heading</h2>
    <div class="appearance">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) =>
          html`
            <oryx-heading tag=${tag}>${tag}</oryx-heading>
            <oryx-heading tag=${tag} appearance="h1">${tag}</oryx-heading>
            <oryx-heading tag=${tag} appearance="h2">${tag}</oryx-heading>
            <oryx-heading tag=${tag} appearance="h3">${tag}</oryx-heading>
            <oryx-heading tag=${tag} appearance="h4">${tag}</oryx-heading>
            <oryx-heading tag=${tag} appearance="h5">${tag}</oryx-heading>
            <oryx-heading tag=${tag} appearance="h6">${tag}</oryx-heading>
          `
      )}
    </div>

    <h2>Appearance heading (medium and larger)</h2>
    <div class="appearance">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) =>
          html`
            <oryx-heading tag=${tag}>${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-appearance="h1">${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-appearance="h2">${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-appearance="h3">${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-appearance="h4">${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-appearance="h5">${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-appearance="h6">${tag}</oryx-heading>
          `
      )}
    </div>

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

      .appearance {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-auto-flow: row;
      }

      .appearance oryx-heading {
        display: flex;
        align-items: center;
      }

      .colorful {
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(
          45deg,
          var(--oryx-color-secondary-300),
          var(--oryx-color-primary-300)
        );
      }
    </style>
  `;
};
