import { ContentMixin, LayoutMixin } from '@spryker-oryx/experience';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { siteNavigationStyles } from './navigation.styles';

@hydrate()
export class SiteNavigationComponent extends LayoutMixin(
  ContentMixin<any>(LitElement)
) {
  static styles = siteNavigationStyles;

  protected override render(): TemplateResult {
    return html`
      <oryx-composition .uid=${this.uid}></oryx-composition>
      ${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}
    `;
  }
}
