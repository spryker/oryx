import { ContentMixin } from '@spryker-oryx/experience';
import { LitRouter } from '@spryker-oryx/router/lit';
import {
  ColorMode,
  elementEffect,
  featureVersion,
  hydrate,
  ssrShim,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { OryxAppOptions } from './oryx-app.model';
import { styles } from './oryx-app.styles';

@ssrShim('style')
@hydrate()
export class OryxAppComponent extends ContentMixin<OryxAppOptions>(LitElement) {
  static styles = styles;

  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult {
    const outletHtml = html`${this.router.outlet()}`;

    if (featureVersion >= '1.2') {
      return outletHtml;
    }

    return html`
      <oryx-composition uid="header"></oryx-composition>
      ${outletHtml}
      <oryx-composition uid="footer"></oryx-composition>
    `;
  }

  /**
   * Color mode effect, sets the color mode based on the colorMode configuration.
   * If the colorMode is not set, the color mode depends on the user's system preferences
   * or the application's color mode set by the color selector.
   */
  @elementEffect() setColorMode = () => {
    const { colorMode } = this.$options();

    this.toggleAttribute('mode-light', colorMode === ColorMode.Light);
    this.toggleAttribute('mode-dark', colorMode === ColorMode.Dark);
  };
}
