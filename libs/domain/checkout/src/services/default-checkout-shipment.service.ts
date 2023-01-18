import { CartService } from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/di';
import { subscribeReplay } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
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

  protected shipments$ = new BehaviorSubject<Shipment[] | null>(null);

  getShipment(): Observable<Shipment | null> {
    return this.cartService
      .getCart()
      .pipe(
        take(1),
        switchMap((cart) => {
          if (!cart) {
            return of({});
          }
          return this.adapter.get({
            cartId: cart.id,
            include: this.includeShipments,
          });
        }),
        // in some cases, when cart is not yet created, we get 422 error from the backend
        catchError(() => of(null)),
        tap((data) => {
          this.handleShipmentData(data);
        })
      )
      .pipe(
        switchMap(() => this.shipments$),
        map((shipments) => (shipments ? shipments[0] : null))
      );
  }

  getCarriers(): Observable<Carrier[]> {
    return this.getShipment().pipe(
      map((shipment) => {
        return shipment?.carriers ?? [];
      })
    );
  }

  protected handleShipmentData(data: CheckoutData | null): void {
    if (!data) {
      return;
    }
    if (data.shipments) {
      this.shipments$.next(data.shipments);
    }
  }

  getSelectedShipmentMethod(): Observable<number> {
    return this.dataService.getShipment().pipe(
      map((details) => details?.idShipmentMethod),
      switchMap((id) =>
        id
          ? of(id)
          : this.getShipment().pipe(
              map((shipment) => {
                return shipment?.selectedShipmentMethod?.id
                  ? Number(shipment.selectedShipmentMethod.id)
                  : 0;
              })
            )
      )
    );
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
