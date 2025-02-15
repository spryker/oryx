import { Carrier, Shipment, ShipmentMethod } from '@spryker-oryx/checkout';
import { Observable, map, of } from 'rxjs';
import {
  mockFilteredShipmentMethods,
  mockShipmentAttributes,
} from './mock-checkout';

export enum ShipmentProviderType {
  Multiple = 'all',
  SingleProvider = 'single-provider',
  SingleProviderMultipleMethods = 'single-provider-multiple-methods',
  NoProvider = 'no-provider',
}

export class MockShipmentService {
  protected type = ShipmentProviderType.Multiple;
  static mockShipment: Shipment = {
    items: [],
    requestedDeliveryDate: null,
    shippingAddress: mockShipmentAttributes.shippingAddress,
    carriers: mockFilteredShipmentMethods,
  };

  changeProviderType(value: ShipmentProviderType) {
    this.type = value;
  }

  protected getShipment(): Observable<Shipment | null> {
    switch (this.type) {
      case ShipmentProviderType.SingleProviderMultipleMethods:
        MockShipmentService.mockShipment.carriers = [
          {
            name: 'Mock Dummy Carrier',
            shipmentMethods: mockFilteredShipmentMethods[0].shipmentMethods,
          },
        ];
        break;
      case ShipmentProviderType.SingleProvider:
        MockShipmentService.mockShipment.carriers = [
          {
            name: 'Mock Dummy Carrier',
            shipmentMethods: [
              mockFilteredShipmentMethods[0].shipmentMethods[0],
            ],
          },
        ];
        break;
      case ShipmentProviderType.NoProvider:
        MockShipmentService.mockShipment.carriers = undefined;
        break;
      case ShipmentProviderType.Multiple:
      default:
        MockShipmentService.mockShipment.carriers = mockFilteredShipmentMethods;
    }
    return of(MockShipmentService.mockShipment);
  }

  getCarriers(): Observable<Carrier[]> {
    return this.getShipment().pipe(map((shipment) => shipment?.carriers ?? []));
  }

  selected(): Observable<ShipmentMethod | null> {
    return this.getShipment().pipe(
      map((shipment) => shipment?.selectedShipmentMethod ?? null)
    );
  }

  select(): Observable<void> {
    return of(undefined);
  }
}
