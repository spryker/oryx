import { I18nContext } from '@spryker-oryx/utilities';
import Globalize from 'globalize';
import type { I18nDataBundle } from './i18n.loader';

/** @internal */
export type GlobalizeCldrImporter = () => object;

/** @internal */
export class GlobalizeService {
  private static MinimalCldrImporters: readonly GlobalizeCldrImporter[] = [
    // TODO: fix to import json files from node_modules when vite 4 will be released
    () => import('./importers/likely-subtags').then((m) => m.default),
    () => import('./importers/plurals').then((m) => m.default),
  ];

  protected loadStatus?: Promise<object[]>;
  protected globalizeCaches: Record<string, Globalize> = Object.create(null);

  constructor(
    protected cldrImporters = [...GlobalizeService.MinimalCldrImporters],
    protected globalize = Globalize
  ) {}

  addCldrImporter(cldrImporter: GlobalizeCldrImporter): void {
    this.cldrImporters.push(cldrImporter);
    this.resetLoadStatus();
  }

  async loadMessages(data: I18nDataBundle): Promise<void> {
    await this.init();
    await this.globalize.loadMessages(data);
    this.dropCaches();
  }

  async formatMessage(
    localeId: string,
    token: string,
    context?: I18nContext
  ): Promise<string | undefined> {
    const globalize = await this.getFor(localeId);

    // If formatMessage throws - the token is not in the dataset
    try {
      return globalize.formatMessage(token, context);
    } catch {
      return;
    }
  }

  async resolveLocales(localeId: string): Promise<string[]> {
    const globalize = await this.getFor(localeId);

    const locales = [
      'root', // This is a fallback for all locales
      globalize.cldr.attributes.minLanguageId,
      globalize.cldr.attributes.maxLanguageId,
    ];

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if ((globalize.cldr.attributes as any).bundle) {
      locales.push((globalize.cldr.attributes as any).bundle);
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return locales;
  }

  protected async getFor(localeId: string): Promise<Globalize> {
    await this.init();

    if (localeId in this.globalizeCaches) {
      return this.globalizeCaches[localeId];
    }

    return (this.globalizeCaches[localeId] = this.globalize(localeId));
  }

  protected async init(): Promise<void> {
    if (this.loadStatus) {
      await this.loadStatus;
      return;
    }

    this.loadStatus = Promise.all(
      this.cldrImporters.map((cldrImporter) => cldrImporter())
    );

    this.globalize.load(await this.loadStatus);
  }

  protected dropCaches(): void {
    this.globalizeCaches = Object.create(null);
  }

  protected resetLoadStatus(): void {
    this.loadStatus = undefined;
    this.dropCaches();
  }
}
