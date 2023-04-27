import { CartService } from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/di';
import { subscribeReplay } from '@spryker-oryx/utilities';
import {
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { ApiCheckoutModel, Carrier, CheckoutData, Shipment } from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutDataService } from './checkout-data.service';
import { CheckoutShipmentService } from './checkout-shipment.service';

export class DefaultCheckoutShipmentService implements CheckoutShipmentService {
  private includeShipments = [
    ApiCheckoutModel.Includes.Shipments,
    ApiCheckoutModel.Includes.ShipmentMethods,
  ];
  constructor(
    protected cartService = inject(CartService),
    protected adapter = inject(CheckoutAdapter),
    protected dataService = inject(CheckoutDataService)
  ) {}

  protected shipments$ = this.cartService.getCart().pipe(
    switchMap((cart) => {
      if (!cart) {
        return of({} as CheckoutData);
      }
      return this.adapter.get({
        cartId: cart.id,
        include: this.includeShipments,
      });
    }),
    // in some cases, when cart is not yet created, we get 422 error from the backend
    catchError(() => of({} as CheckoutData)),
    map((data) => data.shipments?.[0] ?? null),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  getShipment(): Observable<Shipment | null> {
    return this.shipments$;
  }

  getCarriers(): Observable<Carrier[]> {
    return this.getShipment().pipe(
      map((shipment) => {
        return shipment?.carriers ?? [];
      })
    );
  }

  getSelected(): Observable<number | undefined> {
    return this.dataService
      .getShipment()
      .pipe(map((details) => details?.idShipmentMethod));
  }

  setShipmentMethod(method: number): Observable<unknown> {
    return subscribeReplay(
      this.getShipment().pipe(
        take(1),
        switchMap((shipment) =>
          this.dataService.setShipment({
            ...shipment,
            idShipmentMethod: method,
          })
        )
      )
    );
  }
}
