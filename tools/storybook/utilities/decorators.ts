import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import MockDate from 'mockdate';

type DateProp = string | number | Date;

export const OverlaysDecorator =
  (minWidth = 1024, minHeight = 768) =>
  (storyFn: any, context: any): TemplateResult => {
    return html`
      <div style=${`min-width: ${minWidth}px; min-height: ${minHeight}px;`}>
        ${storyFn(context)}
      </div>
    `;
  };

@customElement('oryx-mock-date-mounter')
class MockDateUnmounter extends LitElement {
  @property() date?: DateProp;

  connectedCallback(): void {
    super.connectedCallback();

    //apply mocked date
    if (this.date) {
      MockDate.set(this.date);
    }
  }

  disconnectedCallback(): void {
    //allow to reset mocked date when decorated story is disconnected
    MockDate.reset();

    super.disconnectedCallback();
  }

  render() {
    return;
  }
}

export const MockDateDecorator =
  (date: string | number | Date = new Date('March 20, 2020 20:00:00')) =>
  (storyFn: any, context: any): TemplateResult => {
    return html`
      <oryx-mock-date-mounter .date=${date}></oryx-mock-date-mounter>
      ${storyFn(context)}
    `;
  };
