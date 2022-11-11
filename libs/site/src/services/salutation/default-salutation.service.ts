import { Observable, of } from 'rxjs';
import { Salutation } from '../../models';
import { SalutationService } from './salutation.service';

export class DefaultSalutationService implements SalutationService {
  protected salutations = [
    { text: 'Mr.', value: 'mr' },
    { text: 'Ms.', value: 'ms' },
    { text: 'Mrs.', value: 'mrs' },
    { text: 'Dr.', value: 'dr' },
  ];

  get(): Observable<Salutation[]> {
    return of(this.salutations);
  }
}
