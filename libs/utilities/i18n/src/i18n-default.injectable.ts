import type { I18nContext, I18nInjectable } from './i18n.injectable';

export interface DefaultI18nInjectableOptions {
  tokenPropStart?: string;
  tokenPropEnd?: string;
}

export class DefaultI18nInjectable implements I18nInjectable {
  protected tokenPropStart = this.options?.tokenPropStart ?? '\\<';
  protected tokenPropEnd = this.options?.tokenPropEnd ?? '\\>';
  protected tokenPropRegex = new RegExp(
    `${this.tokenPropStart}([^${this.tokenPropEnd}]+)${this.tokenPropEnd}`,
    'g'
  );

  constructor(protected options?: DefaultI18nInjectableOptions) {}

  translate(token: string | readonly string[], context?: I18nContext): string {
    return this.toReadable(this.select(token), context);
  }

  protected select(token: string | readonly string[]): string {
    return typeof token === 'string' ? token : token[0];
  }

  protected toReadable(
    token: string,
    context?: Record<string, unknown>
  ): string {
    // Get the last part after all dots
    // For example: one.two.three -> three
    const lastPart = token.slice(token.lastIndexOf('.') + 1);

    // Reset regex global state between calls
    this.tokenPropRegex.lastIndex = 0;

    /* eslint-disable @typescript-eslint/explicit-function-return-type */
    const replacePropValue = context
      ? (prop: string) => String(context[prop])
      : () => '';
    /* eslint-enable @typescript-eslint/explicit-function-return-type */

    return (
      lastPart
        // Replace all props with values from context
        .replace(this.tokenPropRegex, (_, prop) => replacePropValue(prop))
        // Replace all dashes with spaces
        .replace(/-/g, ' ')
        // Capitalize first character
        .replace(/^./, (c) => c.toUpperCase())
        // Remove trailing spaces
        .trim()
    );
  }
}
