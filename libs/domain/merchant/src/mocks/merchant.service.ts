import { Observable, of } from 'rxjs';
import { Merchant, MerchantQualifier } from '../models';
import { MerchantService } from '../services';

export class MockMerchantService implements Partial<MerchantService> {
  static mockMerchants: Partial<Merchant>[] = [
    {
      id: '1',
      name: 'Merchant 1',
      schedule: {
        opened: [
          { day: 'monday', times: [{ from: '13:00:00', to: '17:00:00' }] },
          { day: 'tuesday', times: [{ from: '09:00:00', to: '17:00:00' }] },
          { day: 'wednesday' },
          { day: 'thursday', times: [{ from: '09:00:00', to: '21:00:00' }] },
          { day: 'friday', times: [{ from: '09:00:00', to: '17:00:00' }] },
          { day: 'saturday', times: [{ from: '09:00:00', to: '17:00:00' }] },
          { date: '2024-05-05' },
        ],
        closed: [
          { day: 'sunday' },
          { date: '2024-01-01' },
          { date: '2024-12-31' },
        ],
      },
    },
    {
      id: '2',
      name: 'Merchant 2',
      schedule: {
        opened: [
          {
            day: 'monday',
            times: [
              { from: '09:00:00', to: '13:00:00' },
              { from: '14:00:00', to: '18:00:00' },
            ],
          },
          {
            day: 'tuesday',
            times: [{ from: '09:00:00', to: '17:00:00' }],
          },
          {
            day: 'sunday',
          },
        ],
      },
    },
    {
      id: '3',
      name: 'Merchant 3',
      schedule: {
        opened: [
          {
            day: 'monday',
            times: [
              {
                from: '09:00:00',
                to: '13:00:00',
              },
            ],
          },
          {
            date: '2024-05-05',
            times: [
              {
                from: '11:00:00',
                to: '15:00:00',
              },
            ],
          },
        ],
        closed: [
          {
            day: 'sunday',
          },
          {
            date: '2024-05-07',
          },
        ],
      },
    },
  ];

  get(qualifier: MerchantQualifier): Observable<Merchant | undefined> {
    const product = MockMerchantService.mockMerchants.find(
      (p) => p.id === qualifier.id
    ) as Merchant;

    return of(product);
  }
}
