import { inject } from '@spryker-oryx/di';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';
import { Country } from '../../models';
import { StoreService } from '../store';
import { CountryService } from './country.service';

export class DefaultCountryService implements CountryService {
  protected country$ = new BehaviorSubject('');

  constructor(protected storeService = inject(StoreService)) {}

  getAll(): Observable<Country[]> {
    return this.storeService.get().pipe(
      filter(Boolean),
      map((response) => response.countries)
    );
  }

  get(): Observable<Country | null> {
    return combineLatest([this.getAll(), this.country$]).pipe(
      map(
        ([countries, country]) =>
          countries.find((c) => c.iso2Code === country) ?? null
      )
    );
  }

  set(value: string): void {
    this.country$.next(value);
  }
}
