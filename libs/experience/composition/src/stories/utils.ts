import { html, TemplateResult } from 'lit';

export const elements = (count = 12): TemplateResult => html`
  ${Array.from(Array(count).keys()).map(
    (i) => html`
      <div class="el ${i === 1 ? 'has-margin has-padding' : ''}">
        <div class="content">${i + 1}</div>
      </div>
    `
  )}
`;

export const demoStyles = html`
  <style>
    div.el,
    div.content {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
    }
    .content {
      box-sizing: border-box;
      background-color: var(--oryx-color-canvas-200);
      width: 100%;
      height: 100%;
    }
  </style>
`;
