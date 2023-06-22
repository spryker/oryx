import {
  asyncValue,
  I18nContext,
  I18nInjectable,
} from '@spryker-oryx/utilities';
import { html } from 'lit';
import { DirectiveResult } from 'lit/directive.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { I18nService } from './i18n.service';

/**
 * Adapts {@link I18nService} to {@link I18nInjectable}.
 */
export class I18nServiceInjectableAdapter implements I18nInjectable {
  constructor(
    protected i18nService: I18nService,
    protected asyncDirective = asyncValue,
    protected unsafeHTMLDirective = unsafeHTML
  ) {}

  /**
   * Uses {@link asyncValue} directive to convert Observable
   * from {@link I18nService.translate()} to lit render.
   */
  translate(
    token: string | readonly string[],
    context?: I18nContext
  ): string | DirectiveResult {
    return this.asyncDirective(
      this.i18nService.translate(token, context),
      (text) =>
        text.hasHtml
          ? html`${this.unsafeHTMLDirective(text.toString())}`
          : text.toString()
    );
  }
}
