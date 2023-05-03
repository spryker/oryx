import { CartService } from '@spryker-oryx/cart';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { subscribeReplay } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import {
  ApiCheckoutModel,
  Carrier,
  CheckoutData,
  Shipment,
  shipmentCheckoutStorageKey,
  ShipmentMethod,
} from '../../models';
import { CheckoutAdapter } from '../adapter';
import { CheckoutShipmentService } from './checkout-shipment.service';

export class DefaultCheckoutShipmentService implements CheckoutShipmentService {
  constructor(
    protected cartService = inject(CartService),
    protected adapter = inject(CheckoutAdapter),
    protected storage = inject(StorageService)
  ) {}

  // TODO: make this obsolete when we move to a reactive storage
  // (using event listener on client/local storage)
  protected subject = new BehaviorSubject<string | null>(null);

  private includeShipments = [
    ApiCheckoutModel.Includes.Shipments,
    ApiCheckoutModel.Includes.ShipmentMethods,
  ];

  getCarriers(): Observable<Carrier[] | null> {
    return this.getShipment().pipe(
      map((shipment) => shipment?.carriers ?? null)
    );
  }

  select(key: string): Observable<unknown> {
    return subscribeReplay(this.store(key));
  }

  selected(): Observable<ShipmentMethod | null> {
    return this.storage
      .get<string>(shipmentCheckoutStorageKey, StorageType.SESSION)
      .pipe(
        tap((key) => {
          if (key) this.subject.next(key);
        }),
        switchMap(() => this.subject),
        switchMap((key) =>
          this.getCarriers().pipe(
            map(
              (carriers) =>
                carriers
                  ?.find((carrier) =>
                    carrier.shipmentMethods.find((method) => method.id === key)
                  )
                  ?.shipmentMethods.find((method) => method.id === key) ?? null
            )
          )
        )
      );
  }

  // TODO: consider using checkout data api here.
  protected shipments$ = this.cartService.getCart().pipe(
    switchMap((cart) => {
      return !cart?.products?.length
        ? of(null)
        : this.adapter
            .get({
              cartId: cart.id,
              include: [
                ApiCheckoutModel.Includes.Shipments,
                ApiCheckoutModel.Includes.ShipmentMethods,
              ],
            })
            .pipe(tap(console.log));
    }),
    // in some cases, when cart is not yet created, we get 422 error from the backend
    catchError(() => of({} as CheckoutData)),
    map((data) => data?.shipments?.[0] ?? null),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected getShipment(): Observable<Shipment | null> {
    return this.shipments$;
  }

  protected store(key: string): Observable<void> {
    this.subject.next(key);
    return this.storage.set(
      shipmentCheckoutStorageKey,
      key,
      StorageType.SESSION
    );
  }
}
