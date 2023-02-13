import { AddressFormQualifier, AddressFormService } from '@spryker-oryx/user';
import { AddressForm } from '@spryker-oryx/user/address-form';
import { Observable, of } from 'rxjs';

export class MockAddressFormService implements Partial<AddressFormService> {
  static mockForm: Record<string, AddressForm> = {
    US: {
      id: 'US',
      name: 'United States',
      data: {
        options: [
          {
            id: 'salutation',
            label: 'Salutation',
            type: 'select',
            width: 100,
            options: [
              {
                value: 'Mr',
                text: 'Mr',
              },
              {
                value: 'Mrs',
                text: 'Mrs',
              },
              {
                value: 'Miss',
                text: 'Miss',
              },
              {
                value: 'Ms',
                text: 'Ms',
              },
              {
                value: 'Dr',
                text: 'Dr',
              },
            ],
          },
          {
            id: 'firstName',
            label: 'First Name',
            type: 'input',
            required: true,
          },
          {
            id: 'lastName',
            label: 'Last Name',
            type: 'input',
            required: true,
          },
          {
            id: 'company',
            label: 'Company',
            type: 'input',
            required: false,
            width: 100,
          },
          {
            id: 'address1',
            label: 'Street Address or P.O. box',
            type: 'input',
            required: true,
            width: 100,
          },
          {
            id: 'address2',
            label: 'Apt, suite, unit, building, floor, etc.',
            type: 'input',
            required: true,
            width: 100,
          },
          {
            id: 'city',
            label: 'City',
            type: 'input',
            required: true,
            width: 100,
          },
          {
            id: 'state',
            label: 'State/Province',
            type: 'select',
            options: [
              {
                value: 'TX',
                text: 'Texas',
              },
              {
                value: 'CA',
                text: 'California',
              },
              {
                value: 'NY',
                text: 'New York',
              },
            ],
          },
          {
            id: 'zipCode',
            label: 'ZIP code',
            type: 'input',
            required: true,
          },
          {
            id: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            width: 100,
          },
          {
            id: 'phone',
            label: 'Phone',
            type: 'tel',
            required: false,
            width: 100,
          },
        ],
      },
    },
    DE: {
      id: 'DE',
      name: 'Germany',
      data: {
        options: [
          {
            id: 'salutation',
            label: 'Salutation',
            type: 'select',
            width: 100,
            options: [
              {
                value: 'Mr',
                text: 'Mr',
              },
              {
                value: 'Ms',
                text: 'Ms',
              },
              {
                value: 'Dr',
                text: 'Dr',
              },
            ],
          },
          {
            id: 'firstName',
            label: 'First Name',
            type: 'input',
            required: true,
          },
          {
            id: 'lastName',
            label: 'Last Name',
            type: 'input',
            required: true,
          },
          {
            id: 'company',
            label: 'Company',
            width: 100,
            type: 'input',
            required: false,
          },
          {
            id: 'address1',
            label: 'Street and House number',
            width: 100,
            type: 'input',
            required: true,
          },
          {
            id: 'address2',
            label: 'Apt, suite, unit, building, floor, etc.',
            width: 100,
            type: 'input',
            required: true,
          },
          {
            id: 'zipCode',
            label: 'PLZ',
            type: 'input',
            required: true,
          },
          {
            id: 'city',
            label: 'City',
            type: 'input',
            required: true,
          },
          {
            id: 'phone',
            label: 'Phone',
            width: 100,
            type: 'tel',
            required: false,
          },
        ],
      },
    },
  };

  getForm(qualifier: AddressFormQualifier): Observable<AddressForm> {
    if (!MockAddressFormService.mockForm[qualifier.country]) {
      return of(
        MockAddressFormService.mockForm[
          qualifier.fallbackCountry ?? qualifier.country
        ]
      );
    }
    return of(MockAddressFormService.mockForm[qualifier.country]);
  }
}
