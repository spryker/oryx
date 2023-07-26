import {
  I18nContext,
  I18nInjectable,
  I18nTranslation,
  I18nTranslationResult,
} from '@spryker-oryx/utilities';
import { Observable, map } from 'rxjs';
import { I18nService } from './i18n.service';

/**
 * Adapts {@link I18nService} to {@link I18nInjectable}.
 */
export class I18nServiceInjectableAdapter implements I18nInjectable {
  constructor(protected i18nService: I18nService) {}

  /**
   * Converts Observable {@link I18nService.translate()} to lit render.
   */
  translate(
    token: string | readonly string[],
    context?: I18nContext
  ): Observable<I18nTranslation> {
    return this.i18nService.translate(token, context).pipe(
      map((text) =>
        text.hasHtml
          ? ({
              text: text.toString(),
              hasHtml: true,
            } as I18nTranslationResult)
          : text.toString()
      )
    );
  }
}
