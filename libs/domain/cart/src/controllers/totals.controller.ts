import { ContextController } from '@spryker-oryx/core';
import { LitElement, ReactiveController } from 'lit';
import { defer, Observable, of, shareReplay, switchMap } from 'rxjs';
import { NormalizedTotals } from '../models';
import {
  TotalsContext,
  TotalsService,
} from '../services/totals/totals.service';
import { resolve } from '@spryker-oryx/di';

export class TotalsController implements ReactiveController {
  protected context: ContextController;
  protected totalsService: TotalsService;

  constructor(protected host: LitElement) {
    this.host.addController(this);
    this.context = new ContextController(host);
    this.totalsService = resolve(TotalsService);
  }

  hostDisconnected?(): void;

  provideContext(context?: string): void {
    if (context) {
      this.context.provide(TotalsContext.Reference, context);
    }
  }

  getTotals(): Observable<NormalizedTotals | null> {
    return defer(() =>
      this.context.get<string>(TotalsContext.Reference).pipe(
        switchMap((context) => {
          if (!context) return of(null);
          return this.totalsService.get(context);
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      )
    );
  }
}
