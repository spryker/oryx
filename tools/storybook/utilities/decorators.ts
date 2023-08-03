import isChromatic from 'chromatic/isChromatic';
import { html, TemplateResult } from 'lit';
import MockDate from 'mockdate';

export const OverlaysDecorator =
  (width = 1024, height = 768) =>
  (storyFn: any, context: any): TemplateResult => {
    if (!isChromatic()) return storyFn(context);

    //un-applying is happening in global decorator for each story
    //apps/storybook/.storybook/preview.js
    (window.frameElement as HTMLElement).toggleAttribute(
      'chromatic-overlay-decorated',
      true
    );
    (window.frameElement as HTMLElement).style.width = `${width}px`;
    (window.frameElement as HTMLElement).style.height = `${height}px`;

    return html`
      <div style=${`width: ${width}px; height: ${height}px;`}>
        ${storyFn(context)}
      </div>
    `;
  };

export const MockDateDecorator =
  (date: string | number | Date = new Date('March 20, 2020 20:00:00')) =>
  (storyFn: any, context: any): TemplateResult => {
    //reset of mocked date happens in global decorator for each story
    //apps/storybook/.storybook/preview.js
    if (date) {
      MockDate.set(date);
    }

    return storyFn(context);
  };
