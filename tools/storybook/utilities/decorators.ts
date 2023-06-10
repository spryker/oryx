import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
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

@customElement('oryx-mock-date-unmounter')
class MockDateUnmounter extends LitElement {
  disconnectedCallback(): void {
    //allow to reset mocked date when decorated story is disconnected
    MockDate.reset();
    super.disconnectedCallback();
  }

  render() {
    return html``;
  }
}

export const MockDateDecorator =
  (date: string | number | Date = new Date('March 20, 2020 20:00:00')) =>
  (storyFn: any, context: any): TemplateResult => {
    MockDate.reset();
    if (date) {
      MockDate.set(date);
    }

    return html`
      <oryx-mock-date-unmounter></oryx-mock-date-unmounter>
      ${storyFn(context)}
    `;
  };
