import { Observable, of } from 'rxjs';
import { Option } from '../../models';
import { GenderService } from './gender.service';

export class DefaultGenderService implements GenderService {
  protected genders = [
    { text: 'male', value: 'Male' },
    { text: 'female', value: 'Female' },
  ];

  get(): Observable<Option[]> {
    return of(this.genders);
  }
}
