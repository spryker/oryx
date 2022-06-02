import { html, TemplateResult } from 'lit';

export const OverlaysDecorator =
  (minWidth = 1024, minHeight = 768) =>
  (storyFn: any): TemplateResult => {
    return html`
      <div style=${`min-width: ${minWidth}px; min-height: ${minHeight}px;`}>
        ${storyFn()}
      </div>
    `;
  };
