import { Observable, of } from 'rxjs';
import { Country } from '../../models';
import { CountryService } from './country.service';

export class DefaultCountryService implements CountryService {
  get(): Observable<Country[]> {
    return of([
      {
        iso2Code: 'DE',
        name: 'Germany',
        postalCodeMandatory: true,
        postalCodeRegex: '\\d{5}',
      },
      {
        iso2Code: 'US',
        name: 'United States',
        postalCodeMandatory: true,
        postalCodeRegex: '\\d{5}',
      },
    ]);
  }
}
