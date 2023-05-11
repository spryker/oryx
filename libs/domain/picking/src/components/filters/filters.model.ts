import { FormFieldDefinition, FormFieldType } from '@spryker-oryx/form';
import { i18n } from '@spryker-oryx/utilities';

export interface FiltersAttributes {
  open?: boolean;
}

export const fields: FormFieldDefinition[] = [
  {
    id: 'sortBy',
    type: FormFieldType.RadioList,
    label: i18n('picking.filter.sort-by') as string,
    attributes: { direction: 'vertical' },
    options: [
      {
        value: 'requestedDeliveryDate.desc',
        text: 'Earliest pick-up time',
      },
      {
        value: 'requestedDeliveryDate.asc',
        text: 'Latest pick-up time',
      },
      {
        value: 'itemsCount.asc',
        text: 'Largest order size',
      },
      {
        value: 'itemsCount.desc',
        text: 'Smallest order size',
      },
    ],
  },
];
