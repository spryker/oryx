import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { HeadingTag, HeadingVisibility } from '../../heading.model';

const lengthyText = `Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew. Grumpy wizards make toxic brew`;

export const Template: Story = (): TemplateResult => {
  return html`
    <h1>Light DOM</h1>

    <h2>Line clamping</h2>
    <div class="clamped">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return [3, 2, 1].map((line) => {
          return html`<oryx-heading .maxLines=${line} .tag=${tag}>
            ${lengthyText}
          </oryx-heading>`;
        });
      })}
      ${[3, 2, 1].map(
        (line) => html`
          <oryx-heading tag="caption" .maxLines=${line}>
            ${lengthyText}
          </oryx-heading>
        `
      )}
      ${[3, 2, 1].map(
        (line) => html`
          <oryx-heading tag="subtitle" .maxLines=${line}>
            ${lengthyText}
          </oryx-heading>
        `
      )}
    </div>

    <h3>Hidden utility</h3>
    <oryx-heading .lg=${HeadingVisibility.None} .tag=${HeadingTag.H1}>
      hidden on large screen
    </oryx-heading>
    <oryx-heading .md=${HeadingVisibility.None} .tag=${HeadingTag.H1}>
      hidden on medium screen
    </oryx-heading>
    <oryx-heading .sm=${HeadingVisibility.None} .tag=${HeadingTag.H1}>
      hidden on small screen
    </oryx-heading>
    <oryx-heading
      .lg=${HeadingTag.H3}
      .md=${HeadingVisibility.None}
      .sm=${HeadingVisibility.None}
    >
      hidden on all, but on large screen
    </oryx-heading>
    <oryx-heading
      .lg=${HeadingVisibility.None}
      .md=${HeadingTag.H3}
      .sm=${HeadingVisibility.None}
    >
      hidden on all, but on medium screen
    </oryx-heading>
    <oryx-heading
      .lg=${HeadingVisibility.None}
      .md=${HeadingVisibility.None}
      .sm=${HeadingTag.H3}
    >
      hidden on all, but on small screen
    </oryx-heading>

    <h3>"typography"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return html`
          <oryx-heading .tag=${tag} typography="h1">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} typography="h2">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} typography="h3">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} typography="h4">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} typography="h5">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} typography="h6">${tag}</oryx-heading>
        `;
      })}
    </div>

    <h2>Large screen</h2>
    <h3>"lg"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return html`
          <oryx-heading .tag=${tag} lg="h1">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} lg="h2">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} lg="h3">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} lg="h4">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} lg="h5">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} lg="h6">${tag}</oryx-heading>
        `;
      })}
    </div>

    <h2>Medium screens</h2>
    <h3>"md"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return html`
          <oryx-heading .tag=${tag} md="h1">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} md="h2">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} md="h3">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} md="h4">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} md="h5">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} md="h6">${tag}</oryx-heading>
        `;
      })}
    </div>

    <h2>Small screen</h2>
    <h3>"sm"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return html`
          <oryx-heading .tag=${tag} sm="h1">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} sm="h2">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} sm="h3">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} sm="h4">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} sm="h5">${tag}</oryx-heading>
          <oryx-heading .tag=${tag} sm="h6">${tag}</oryx-heading>
        `;
      })}
    </div>

    <h2>Colorful</h2>
    ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
      return html`<oryx-heading .tag=${tag}
        >Grumpy wizards make toxic brew.
        <span class="colorful">Grumpy wizards</span> make toxic
        brew</oryx-heading
      >`;
    })}
    <oryx-heading tag="caption">
      Grumpy wizards make toxic brew.
      <span class="colorful">Grumpy wizards</span> make toxic brew
    </oryx-heading>

    <oryx-heading tag="subtitle">
      Grumpy wizards make toxic brew.
      <span class="colorful">Grumpy wizards</span> make toxic brew
    </oryx-heading>

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

    <h2>"typography"</h2>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) =>
          html`
            <oryx-heading tag=${tag} typography="h1">${tag}</oryx-heading>
            <oryx-heading tag=${tag} typography="h2">${tag}</oryx-heading>
            <oryx-heading tag=${tag} typography="h3">${tag}</oryx-heading>
            <oryx-heading tag=${tag} typography="h4">${tag}</oryx-heading>
            <oryx-heading tag=${tag} typography="h5">${tag}</oryx-heading>
            <oryx-heading tag=${tag} typography="h6">${tag}</oryx-heading>
          `
      )}
    </div>

    <h2>Large screen</h2>
    <h3>"lg"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return html`
          <oryx-heading tag=${tag} lg="h1">${tag}</oryx-heading>
          <oryx-heading tag=${tag} lg="h2">${tag}</oryx-heading>
          <oryx-heading tag=${tag} lg="h3">${tag}</oryx-heading>
          <oryx-heading tag=${tag} lg="h4">${tag}</oryx-heading>
          <oryx-heading tag=${tag} lg="h5">${tag}</oryx-heading>
          <oryx-heading tag=${tag} lg="h6">${tag}</oryx-heading>
        `;
      })}
    </div>

    <h2>Medium screen</h2>
    <h3>"md"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return html`
          <oryx-heading tag=${tag} md="h1">${tag}</oryx-heading>
          <oryx-heading tag=${tag} md="h2">${tag}</oryx-heading>
          <oryx-heading tag=${tag} md="h3">${tag}</oryx-heading>
          <oryx-heading tag=${tag} md="h4">${tag}</oryx-heading>
          <oryx-heading tag=${tag} md="h5">${tag}</oryx-heading>
          <oryx-heading tag=${tag} md="h6">${tag}</oryx-heading>
        `;
      })}
    </div>

    <h2>Small screen</h2>
    <h3>"sm"</h3>
    <div class="as">
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
        (tag) => html`<div>(${tag})</div>`
      )}
      ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => {
        return html`
          <oryx-heading tag=${tag} sm="h1">${tag}</oryx-heading>
          <oryx-heading tag=${tag} sm="h2">${tag}</oryx-heading>
          <oryx-heading tag=${tag} sm="h3">${tag}</oryx-heading>
          <oryx-heading tag=${tag} sm="h4">${tag}</oryx-heading>
          <oryx-heading tag=${tag} sm="h5">${tag}</oryx-heading>
          <oryx-heading tag=${tag} sm="h6">${tag}</oryx-heading>
        `;
      })}
    </div>

    <h2>Colorful</h2>
    ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'caption', 'subtitle'].map(
      (tag) => html` <oryx-heading .tag=${tag}>
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
