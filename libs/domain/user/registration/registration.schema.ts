import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { PasswordVisibilityStrategy } from '@spryker-oryx/ui/password';
import { UserRegistrationComponent } from './registration.component';

export const registrationComponentSchema: ContentComponentSchema<UserRegistrationComponent> =
  {
    name: 'Auth Registration',
    group: 'Auth',
    icon: IconTypes.Login,
    options: {
      passwordVisibility: {
        type: FormFieldType.Select,
        options: [
          { value: PasswordVisibilityStrategy.None },
          { value: PasswordVisibilityStrategy.Mousedown },
          { value: PasswordVisibilityStrategy.Click },
          { value: PasswordVisibilityStrategy.Hover },
        ],
      },
      minLength: { type: FormFieldType.Number },
      maxLength: { type: FormFieldType.Number },
      minUppercaseChars: { type: FormFieldType.Number },
      minNumbers: { type: FormFieldType.Number },
      minSpecialChars: { type: FormFieldType.Number },
    },
  };
