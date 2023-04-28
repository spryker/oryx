import { html, TemplateResult } from 'lit';
import MockDate from 'mockdate';

export const OverlaysDecorator = (minWidth = 1024, minHeight = 768) =>
  (storyFn: any): TemplateResult => {
    return html`
      <div style=${`min-width: ${minWidth}px; min-height: ${minHeight}px;`}>
        ${storyFn()}
      </div>
    `;
  };

export const MockDateDecorator = (date?: string | number | Date) =>
  (storyFn: any, context: any): TemplateResult => {
    MockDate.reset();
    if (date) {
      MockDate.set(date);
    }
    return storyFn(context);
  };
