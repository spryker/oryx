import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { LitElement, ReactiveController } from 'lit';
import { Observable, defer, shareReplay, switchMap } from 'rxjs';
import { NormalizedTotals } from '../models';
import {
  TotalsContext,
  TotalsService,
} from '../services/totals/totals.service';

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
    if (context) this.context.provide(TotalsContext.Reference, context);
  }

  getTotals(): Observable<NormalizedTotals | null> {
    return defer(() =>
      this.context.get<string>(TotalsContext.Reference).pipe(
        switchMap((context) => {
          return this.totalsService.get(context);
        }),
        shareReplay({ refCount: true, bufferSize: 1 })
      )
    );
  }
}
