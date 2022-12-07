import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit-html';
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
    </div>

    <h2>Mimic heading</h2>
    <div class="mimic">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        const el = unsafeHTML(`<${tag}>${tag}</${tag}>`);
        return html`
          <oryx-heading>${el}</oryx-heading>
          <oryx-heading mimic="h1">${el}</oryx-heading>
          <oryx-heading mimic="h2">${el}</oryx-heading>
          <oryx-heading mimic="h3">${el}</oryx-heading>
          <oryx-heading mimic="h4">${el}</oryx-heading>
          <oryx-heading mimic="h5">${el}</oryx-heading>
          <oryx-heading mimic="h6">${el}</oryx-heading>
        `;
      })}
    </div>

    <h2>Mimic heading (medium and larger)</h2>
    <div class="mimic">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        const el = unsafeHTML(`<${tag}>${tag}</${tag}>`);
        return html`
          <oryx-heading>${el}</oryx-heading>
          <oryx-heading md-mimic="h1">${el}</oryx-heading>
          <oryx-heading md-mimic="h2">${el}</oryx-heading>
          <oryx-heading md-mimic="h3">${el}</oryx-heading>
          <oryx-heading md-mimic="h4">${el}</oryx-heading>
          <oryx-heading md-mimic="h5">${el}</oryx-heading>
          <oryx-heading md-mimic="h6">${el}</oryx-heading>
        `;
      })}
    </div>

    <h2>Colorful</h2>
    ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
      const el = unsafeHTML(`<${tag}>Grumpy wizards make toxic brew.
      <span class="colorful">Grumpy wizards</span> make toxic brew</${tag}>`);
      return html`<oryx-heading>${el}</oryx-heading>`;
    })}

    <h1>Shadow DOM</h1>

    <h2>Mimic heading</h2>
    <div class="mimic">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) =>
          html`
            <oryx-heading tag=${tag}>${tag}</oryx-heading>
            <oryx-heading tag=${tag} mimic="h1">${tag}</oryx-heading>
            <oryx-heading tag=${tag} mimic="h2">${tag}</oryx-heading>
            <oryx-heading tag=${tag} mimic="h3">${tag}</oryx-heading>
            <oryx-heading tag=${tag} mimic="h4">${tag}</oryx-heading>
            <oryx-heading tag=${tag} mimic="h5">${tag}</oryx-heading>
            <oryx-heading tag=${tag} mimic="h6">${tag}</oryx-heading>
          `
      )}
    </div>

    <h2>Mimic heading (medium and larger)</h2>
    <div class="mimic">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) =>
          html`
            <oryx-heading tag=${tag}>${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-mimic="h1">${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-mimic="h2">${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-mimic="h3">${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-mimic="h4">${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-mimic="h5">${tag}</oryx-heading>
            <oryx-heading tag=${tag} md-mimic="h6">${tag}</oryx-heading>
          `
      )}
    </div>

    <h2>Line clamping</h2>
    <div class="clamped">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle'].map((tag) => {
        return [3, 2, 1].map((line) => {
          return html`<oryx-heading tag=${tag} maxLines=${line}
            >${lengthyText}</oryx-heading
          >`;
        });
      })}
    </div>

    <h2>Colorful</h2>
    ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle'].map(
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

      .mimic {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-auto-flow: row;
      }

      .mimic oryx-heading {
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
