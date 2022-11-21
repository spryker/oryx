import { CartService } from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/injector';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ApiCheckoutModel, Carrier, CheckoutData, Shipment } from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutShipmentService } from './checkout-shipment.service';

export class DefaultCheckoutShipmentService implements CheckoutShipmentService {
  private includeShipments = [
    ApiCheckoutModel.Includes.Shipments,
    ApiCheckoutModel.Includes.ShipmentMethods,
  ];
  constructor(
    protected cartService = inject(CartService),
    protected adapter = inject(CheckoutAdapter)
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
            idCart: cart.id,
            include: this.includeShipments,
          });
        }),
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
    return this.getShipment().pipe(
      map((shipment) => {
        return shipment?.selectedShipmentMethod?.id
          ? Number(shipment.selectedShipmentMethod.id)
          : 0;
      })
    );
  }

  setShipmentMethod(method: number): Observable<void> {
    return this.cartService.getCart().pipe(
      switchMap((cart) => {
        if (!cart) {
          return of(null);
        }

        return this.adapter.update({
          idCart: cart.id,
          include: this.includeShipments,
          attributes: {
            shipment: {
              idShipmentMethod: method,
            },
          },
        });
      }),
      switchMap((result) => {
        if (result?.shipments && result.shipments?.length > 0) {
          this.handleShipmentData(result);
        }
        return of(undefined);
      })
    );
  }
}
