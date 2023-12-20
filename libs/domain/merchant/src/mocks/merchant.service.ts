import { Observable, of } from 'rxjs';
import { Merchant, MerchantQualifier } from '../models';
import { MerchantService } from '../services';

export class MockMerchantService implements Partial<MerchantService> {
  static mockMerchants: Partial<Merchant>[] = [
    {
      id: '1',
      name: 'Merchant 1',
      banner:
        'https://d2s0ynfc62ej12.cloudfront.net/merchant/sonyexperts-banner.png',
      url: 'https://www.foobarbrand.com',
      contact: {
        phone: '+49 111 222 333',
        email: 'info@foobarbrand.com',
      },
      schedule: {
        weekdays: [
          {
            day: 'monday',
            times: [
              { from: '07:00:00.000000', to: '13:00:00.000000' },
              { from: '14:00:00.000000', to: '20:00:00.000000' },
            ],
          },
          {
            day: 'tuesday',
            times: [{ from: '07:00:00.000000', to: '20:00:00.000000' }],
          },
          {
            day: 'wednesday',
            times: [{ from: '07:00:00.000000', to: '20:00:00.000000' }],
          },
          {
            day: 'thursday',
            times: [{ from: '07:00:00.000000', to: '20:00:00.000000' }],
          },
          {
            day: 'friday',
            times: [{ from: '07:00:00.000000', to: '20:00:00.000000' }],
          },
          {
            day: 'saturday',
            times: [{ from: '07:00:00.000000', to: '20:00:00.000000' }],
          },
          {
            day: 'sunday',
          },
        ],
        dates: [
          {
            date: '2023-11-28',
            // "note": "Sunday Opening",
            times: [{ from: '13:00:00.000000', to: '18:00:00.000000' }],
          },
          {
            date: '2023-12-31',
            times: [
              { from: '10:00:00.000000', to: '12:00:00.000000' },
              { from: '13:00:00.000000', to: '16:00:00.000000' },
            ],
          },

          {
            date: '2024-01-01',
            // "note": "New Year's Day"
          },
          {
            date: '2024-04-10',
            // "note": "Good Friday"
          },
          {
            date: '2024-04-12',
            // "note": "Easter Sunday"
          },
          {
            date: '2024-04-13',
            // "note": "Easter Monday"
          },
          {
            date: '2024-05-01',
            // "note": "May Day"
          },
          {
            date: '2024-05-21',
            // "note": "Ascension of Christ"
          },
          {
            date: '2024-05-31',
            // "note": "Whit Sunday"
          },
          {
            date: '2024-06-01',
            // "note": "Whit Monday"
          },
          {
            date: '2024-06-11',
            // "note": "Corpus Christi"
          },
          {
            date: '2024-10-03',
            // "note": "Day of German unity"
          },
          {
            date: '2024-11-01',
            // "note": "All Saints' Day"
          },
          {
            date: '2024-12-25',
            // "note": "1st Christmas day"
          },
          {
            date: '2024-12-26',
            // "note": "2nd Christmas day"
          },
        ],
      },
    },
  ];

  get(qualifier: MerchantQualifier): Observable<Merchant | undefined> {
    const merchant = MockMerchantService.mockMerchants.find(
      (m) => m.id === qualifier.id
    ) as Merchant;

    return of(merchant);
  }
}
