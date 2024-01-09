import { Product, ProductQualifier } from '@spryker-oryx/product';

import { MockProductService } from '@spryker-oryx/product/mocks';
import { Observable, of } from 'rxjs';
import { productForOfferTransform } from '../product';

export class MockMerchantProductService extends MockProductService {
  static mockMerchantProducts: Product[] = [
    {
      sku: 'mp-1',
      price: {
        defaultPrice: { value: 1879, isNet: true, currency: 'EUR' },
        originalPrice: { value: 1779, isNet: true, currency: 'EUR' },
      },
      offers: [
        {
          id: 'offer-1',
          merchant: {
            id: 'MER000005',
            name: 'Budget Cameras',
            deliveryTime: '1-3 days',
          },
          price: {
            defaultPrice: { value: 1579, isNet: true, currency: 'EUR' },
          },
        },
        {
          id: 'offer-2',
          merchant: {
            id: 'MER000005',
            name: 'Video King',
          },
          price: {
            defaultPrice: { value: 1879, isNet: true, currency: 'EUR' },
          },
          availability: {
            quantity: 5,
          },
        },
        {
          id: 'offer-3',
          merchant: {
            id: 'MER000005',
            name: 'Sony',
            deliveryTime: '2-4 days',
          },
          price: {
            defaultPrice: { value: 1279, isNet: true, currency: 'EUR' },
          },
          availability: {
            isNeverOutOfStock: true,
          },
        },
      ],
    },
    {
      sku: 'mp-2',
      price: {
        defaultPrice: { value: 1879, isNet: true, currency: 'EUR' },
      },
      availability: {
        isNeverOutOfStock: true,
        quantity: 0,
        availability: false,
      },
      offers: [
        {
          id: 'offer-2',
          merchant: {
            id: 'MER000005',
            name: 'Video King',
            deliveryTime: '2-4 days',
          },
          price: {
            defaultPrice: {
              value: 1879,
              isNet: true,
              currency: 'EUR',
            },
          },
        },
      ],
    },
  ];

  get(qualifier: ProductQualifier): Observable<Product> {
    const product = MockMerchantProductService.mockMerchantProducts.find(
      (p) => p.sku === qualifier.sku
    ) as Product;

    if (!product) return super.get(qualifier);

    return of(productForOfferTransform(product, qualifier) as Product);
  }
}
