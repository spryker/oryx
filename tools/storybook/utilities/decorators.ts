import { html, TemplateResult } from 'lit';
import MockDate from 'mockdate';

export const OverlaysDecorator =
  (minWidth = 1024, minHeight = 768) =>
  (storyFn: any, context: any): TemplateResult => {
    return html`
      <div style=${`min-width: ${minWidth}px; min-height: ${minHeight}px;`}>
        ${storyFn(context)}
      </div>
    `;
  };

export const MockDateDecorator =
  (date: string | number | Date = new Date('March 20, 2020 20:00:00')) =>
  (storyFn: any, context: any): TemplateResult => {
    if (date) {
      MockDate.set(date);
    }

    return storyFn(context);
  };
