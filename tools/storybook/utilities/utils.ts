import { html, TemplateResult } from 'lit';

export const sideBySide = (
  story: TemplateResult,
  style?: TemplateResult
): TemplateResult => {
  return html`
    <div class="stories">${story}${story}</div>

    <style>
      .stories {
        display: flex;
        gap: 10px;
      }
      .stories > *:last-child {
        --oryx-popover-visible: 1;
      }
      oryx-select {
        flex: 0 0 350px;
        width: 350px;
      }
    </style>

    ${style}
  `;
};
