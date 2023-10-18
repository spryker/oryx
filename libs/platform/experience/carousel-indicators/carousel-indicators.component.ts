import { LitElement, TemplateResult, html } from 'lit';

export class CarouselIndicatorsComponent extends LitElement {
  //   static styles = carouselIndicatorsStyles;

  protected override render(): TemplateResult | void {
    return html`<slot></slot>`;
  }
}
