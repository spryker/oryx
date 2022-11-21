import {
  Carrier,
  CheckoutShipmentService,
  Shipment,
} from '@spryker-oryx/checkout';
import { map, Observable, of } from 'rxjs';
import {
  mockFilteredShipmentMethods,
  mockShipmentAttributes,
} from './mock-checkout';

export enum ProviderType {
  Multiple = 'all',
  SingleProvider = 'single-provider',
  SingleProviderMultipleMethods = 'single-provider-multiple-methods',
  NoProvider = 'no-provider',
}

export class MockShipmentService implements Partial<CheckoutShipmentService> {
  protected type = ProviderType.Multiple;
  static mockShipment: Shipment = {
    items: [],
    requestedDeliveryDate: null,
    shippingAddress: mockShipmentAttributes.shippingAddress,
    carriers: mockFilteredShipmentMethods,
  };

  changeProviderType(value: ProviderType) {
    this.type = value;
  }
  getShipment(): Observable<Shipment | null> {
    switch (this.type) {
      case ProviderType.SingleProviderMultipleMethods:
        MockShipmentService.mockShipment.carriers = [
          {
            name: 'Mock Dummy Carrier',
            shipmentMethods: mockFilteredShipmentMethods[0].shipmentMethods,
          },
        ];
        break;
      case ProviderType.SingleProvider:
        MockShipmentService.mockShipment.carriers = [
          {
            name: 'Mock Dummy Carrier',
            shipmentMethods: [
              mockFilteredShipmentMethods[0].shipmentMethods[0],
            ],
          },
        ];
        break;
      case ProviderType.NoProvider:
        MockShipmentService.mockShipment.carriers = undefined;
        break;
      case ProviderType.Multiple:
      default:
        MockShipmentService.mockShipment.carriers = mockFilteredShipmentMethods;
    }
    return of(MockShipmentService.mockShipment);
  }

  getCarriers(): Observable<Carrier[]> {
    return this.getShipment().pipe(map((shipment) => shipment?.carriers ?? []));
  }

  getSelectedShipmentMethod(): Observable<number> {
    return this.getShipment().pipe(
      map((shipment) =>
        shipment?.selectedShipmentMethod?.id
          ? Number(shipment.selectedShipmentMethod.id)
          : 0
      )
    );
  }
}
