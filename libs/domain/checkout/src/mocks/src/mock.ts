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
    deliveryTime: 1684568761694,
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
    deliveryTime: 1684568761694 + 86400000,
  },
] as ShipmentMethod[];
