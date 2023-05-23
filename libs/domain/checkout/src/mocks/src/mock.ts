import { PaymentMethod, ShipmentMethod } from '../../models';

export const mockPayments: PaymentMethod[] = [
  { id: '1', name: 'Paypal', provider: '' },
  { id: '2', name: 'Credit card', provider: '' },
  { id: '3', name: 'Invoice', provider: '' },
];

export const mockShipments = [
  {
    id: '1',
    name: 'Standard Mock',
    price: 490,
    deliveryTime: new Date('2020-10-11').getTime(),
  },
  {
    id: '2',
    name: 'Express mock',
    price: 500,
  },
  {
    id: '3',
    name: 'Mock Express',
    price: 500,
  },
  {
    id: '4',
    name: 'Mock Method',
    price: 300,
    deliveryTime: new Date('2020-11-15').getTime(),
  },
] as ShipmentMethod[];

export const mockCarriers = [
  {
    name: 'Mock Dummy Carrier',
    shipmentMethods: [mockShipments[0], mockShipments[1]],
  },
  {
    name: 'Mock Drone Carrier',
    shipmentMethods: [mockShipments[2], mockShipments[3]],
  },
];
