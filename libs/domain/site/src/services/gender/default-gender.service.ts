import { FormFieldOption } from '@spryker-oryx/form';
import { Observable, of } from 'rxjs';
import { GenderService } from './gender.service';

export class DefaultGenderService implements GenderService {
  protected genders = [
    { text: 'male', value: 'Male' },
    { text: 'female', value: 'Female' },
  ];

  get(): Observable<FormFieldOption[]> {
    return of(this.genders);
  }
}
