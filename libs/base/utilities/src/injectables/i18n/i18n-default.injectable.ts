import { defaultI18nContextFilters } from './filters';
import { I18nContextFilter } from './i18n-context-filter';
import type {
  I18nContext,
  I18nContextPropEnd,
  I18nContextPropStart,
  I18nInjectable,
  I18nTranslation,
  I18nTranslationResult,
} from './i18n.injectable';

export interface DefaultI18nInjectableOptions {
  tokenPropStart?: I18nContextPropStart;
  tokenPropEnd?: I18nContextPropEnd;
  filters?: I18nContextFilter[];
}

export class DefaultI18nInjectable implements I18nInjectable {
  static DefaultFilters = defaultI18nContextFilters;

  protected tokenPropStart: I18nContextPropStart =
    this.options?.tokenPropStart ?? '<';
  protected tokenPropEnd: I18nContextPropEnd =
    this.options?.tokenPropEnd ?? '>';
  protected tokenPropRegex = new RegExp(
    `${this.tokenPropStart}([^${this.tokenPropEnd}]+)${this.tokenPropEnd}`,
    'g'
  );

  protected filters = (
    this.options?.filters ?? DefaultI18nInjectable.DefaultFilters
  ).reduce(
    (filters, filter) => ({
      ...filters,
      [filter.getName()]: filter,
    }),
    Object.create(null) as Record<string, I18nContextFilter | undefined>
  );

  constructor(protected options?: DefaultI18nInjectableOptions) {}

  translate(
    token: string | readonly string[],
    context?: I18nContext
  ): I18nTranslation {
    return this.toReadable(this.select(token), context);
  }

  hasHtml(token: string, context?: I18nContext): boolean {
    // Reset regex global state between calls
    this.tokenPropRegex.lastIndex = 0;

    const tokens = Array.from(token.matchAll(this.tokenPropRegex));

    // Iterate all tokens and check if any of them produces HTML
    const hasHtml = tokens.some(([, token]) => {
      const { filters } = this.extractFilters(token, context);

      return Object.keys(filters).some((name) =>
        this.filters[name]?.producesHtml?.()
      );
    });

    return hasHtml;
  }

  protected select(token: string | readonly string[]): string {
    return typeof token === 'string' ? token : token[0];
  }

  protected toReadable(token: string, context?: I18nContext): I18nTranslation {
    // Reset regex global state between calls
    this.tokenPropRegex.lastIndex = 0;

    // Get the last part after all dots
    // For example: one.two.three -> three
    const lastPart = token.slice(token.lastIndexOf('.') + 1);

    let hasHtml = false;

    const text = lastPart
      // Replace all dashes with spaces
      .replace(/-/g, ' ')
      // Capitalize first character
      .replace(/^./, (c) => c.toUpperCase())
      // Replace all props with values from context
      .replace(this.tokenPropRegex, (_, token) => {
        const result = this.applyFilters(token, context);

        hasHtml = result.hasHtml || hasHtml;

        return result.text as string;
      })
      // Remove trailing spaces
      .trim();

    return hasHtml ? { text, hasHtml } : text;
  }

  protected tokenToStr(token: unknown): string {
    return String(token ?? '');
  }

  protected applyFilters(
    token: string,
    context?: I18nContext
  ): I18nTranslationResult {
    const valueOrConfig = context?.[token];

    if (typeof valueOrConfig !== 'object') {
      return { text: this.tokenToStr(valueOrConfig) };
    }

    const { value, filters } = this.extractFilters(token, context);
    let hasHtml = false;

    const text = Object.entries(filters).reduce((value, [name, config]) => {
      const filter = this.filters[name];

      hasHtml = filter?.producesHtml?.() || hasHtml;

      return filter?.process(value, config, context) ?? value;
    }, this.tokenToStr(value));

    return { text, hasHtml };
  }

  private extractFilters(token: string, context?: I18nContext) {
    const valueOrConfig = context?.[token];

    if (typeof valueOrConfig !== 'object') {
      return { value: token, filters: {} };
    }

    const { value = token, ...filters } = valueOrConfig ?? {};

    return { value, filters };
  }
}
