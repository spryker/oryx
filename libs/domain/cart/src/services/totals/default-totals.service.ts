import { resolve } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { NormalizedTotals } from '../../models';
import { CartService } from '../cart.service';
import { TotalsResolver, TotalsService } from './totals.service';

export class DefaultTotalsService implements TotalsService {
  protected cartService = resolve(CartService);

  protected getReference(ref: string): string {
    return `${TotalsResolver}${ref}`;
  }

  get(context: string): Observable<NormalizedTotals | null> {
    return (resolve(this.getReference(context)) as TotalsResolver).getTotals();
  }
}
