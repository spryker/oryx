import { html, TemplateResult } from 'lit';

export const OverlaysDecorator = (storyFn: any): TemplateResult => {
  return html` <div style="width: 1024px; height: 768px;">${storyFn()}</div> `;
};
