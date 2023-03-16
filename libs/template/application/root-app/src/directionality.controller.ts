import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/site';
import { LitElement, ReactiveController } from 'lit';
import { Observable, of, tap } from 'rxjs';

export class DirectionalityController implements ReactiveController {
  protected localeService = resolve(LocaleService, null);

  install(): Observable<string | undefined> {
    if (!this.localeService?.get()) {
      return of(undefined);
    }

    return this.localeService
      .get()
      .pipe(tap((locale) => this.setDirection(locale as string)));
  }

  hostConnected?(): void;

  constructor(protected host: LitElement) {
    this.host.addController(this);
  }

  protected setDirection(localeCode: string): void {
    debugger;
    if (Intl.Locale.prototype.getTextInfo) {
      const locale = new Intl.Locale(localeCode);
      this.host.setAttribute('dir', (locale as any).textInfo.direction);
    } else {
      // FF doesn't support textInfo
      const dir = ['ar', 'he'].includes(localeCode) ? 'rtl' : 'ltr';
      this.host.setAttribute('dir', dir);
    }
  }
}
