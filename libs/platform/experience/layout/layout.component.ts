import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { LayoutAttributes } from './layout.model';

@hydrate()
export class LayoutComponent extends LayoutMixin(
  ContentMixin<LayoutAttributes>(LitElement)
) {
  protected override render(): TemplateResult {
    return this.renderLayout(html`<slot></slot>`);
  }
}
