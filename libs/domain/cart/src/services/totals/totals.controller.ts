import { resolve } from "@spryker-oryx/di";
import { Observable, defer, of, shareReplay, switchMap } from "rxjs";
import { NormalizedTotals } from "../../models";
import { TotalsContext, TotalsService } from "./totals.service";
import { ContextController } from "@spryker-oryx/core";
import { LitElement, ReactiveController } from "lit";

export class TotalsController implements ReactiveController {
  protected context: ContextController;
  
  constructor(protected host: LitElement) {
    this.host.addController(this);
    this.context = new ContextController(host);
  }

  hostDisconnected?(): void;

  protected getReference(ref: string): string {
    return `${TotalsService}${ref}`;
  }

  provideContext(context: string): void {
    this.context.provide(TotalsContext.Reference, context);
  };

  getTotals(): Observable<NormalizedTotals | null> {
    return defer(() => this.context.get<string>(TotalsContext.Reference).pipe(
      switchMap((context) => {
        if (!context) return of(null);
        return (resolve(this.getReference(context)) as TotalsService).getTotals();
      }),
      shareReplay({ refCount: true, bufferSize: 1 })
    ))
  }
}