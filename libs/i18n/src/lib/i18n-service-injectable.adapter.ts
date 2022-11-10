import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { I18nInjectable } from '@spryker-oryx/utilities/i18n';
import { DirectiveResult } from 'lit/directive.js';
import { I18nService } from './i18n.service';

/**
 * Adapts {@link I18nService} to {@link I18nInjectable}.
 */
export class I18nServiceInjectableAdapter implements I18nInjectable {
  constructor(protected i18nService: I18nService) {}

  /**
   * Uses {@link asyncValue} directive to convert Observable
   * from {@link I18nService.translate()} to lit render.
   */
  translate(
    token: string | readonly string[],
    context?: Record<string, unknown> | undefined
  ): string | DirectiveResult {
    return asyncValue(this.i18nService.translate(token, context));
  }
}
