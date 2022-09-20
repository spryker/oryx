import { CartService } from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/injector';
import { BehaviorSubject, Observable, of, switchMap, take, tap } from 'rxjs';
import { ApiCheckoutModel, CheckoutData, Shipment } from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutService } from './checkout.service';

export class DefaultCheckoutService implements CheckoutService {
  private includeShipments = [
    ApiCheckoutModel.Includes.Shipments,
    ApiCheckoutModel.Includes.ShipmentMethods,
  ];
  constructor(
    protected cartService = inject(CartService),
    protected adapter = inject(CheckoutAdapter)
  ) {}

  protected shipments$ = new BehaviorSubject<Shipment[] | null>(null);

  getShipments(): Observable<Shipment[] | null> {
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
      .pipe(switchMap(() => this.shipments$));
  }

  protected handleShipmentData(data: CheckoutData | null): void {
    if (!data) {
      return;
    }
    if (data.shipments) {
      this.shipments$.next(data.shipments);
    }
  }

  setShipmentMethod(
    method: number,
    shipment: Shipment
  ): Observable<Shipment[] | null> {
    return this.cartService.getCart().pipe(
      switchMap((cart) => {
        if (!cart || !shipment) {
          return of(null);
        }
        const attributes = { ...shipment };

        delete attributes.id;
        delete attributes.selectedShipmentMethod;
        attributes.idShipmentMethod = method;

        return this.adapter.update({
          idCart: cart.id,
          include: this.includeShipments,
          attributes: {
            shipments: [attributes],
          },
        });
      }),
      switchMap((result) => {
        this.handleShipmentData(result ?? null);
        return this.shipments$;
      })
    );
  }
}
