import { Observable, of } from 'rxjs';
import { Option } from '../../models';
import { SalutationService } from './salutation.service';

export class DefaultSalutationService implements SalutationService {
  protected salutations = [
    { text: 'mr', value: 'Mr' },
    { text: 'ms', value: 'Ms' },
    { text: 'mrs', value: 'Mrs' },
    { text: 'dr', value: 'Dr' },
  ];

  get(): Observable<Option[]> {
    return of(this.salutations);
  }
}
