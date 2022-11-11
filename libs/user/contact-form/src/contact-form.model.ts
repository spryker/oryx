import { ComponentTypeDataFields, FormFieldType } from '@spryker-oryx/form';

export const fields: ComponentTypeDataFields[] = [
  {
    id: 'firstName',
    type: FormFieldType.TEXT,
    label: 'First Name',
  },
  {
    id: 'lastName',
    type: FormFieldType.TEXT,
    label: 'Last Name',
  },
  {
    id: 'email',
    type: FormFieldType.EMAIL,
    label: 'Email',
    required: true,
    width: 100,
  },
];
