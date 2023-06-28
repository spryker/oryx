import { resolve } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { NormalizedTotals } from '../../models';
import { CartService } from '../cart.service';
import { TotalsService, TotalsServiceProvider } from './totals.service';

export class DefaultTotalsService implements TotalsService {
  protected cartService = resolve(CartService);

  protected getReference(ref: string): string {
    return `${TotalsServiceProvider}${ref}`;
  }

  get(context: string): Observable<NormalizedTotals | null> {
    return (
      resolve(this.getReference(context)) as TotalsServiceProvider
    ).getTotals();
  }
}
