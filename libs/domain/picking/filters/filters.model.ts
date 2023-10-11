import { FormFieldDefinition, FormFieldType } from '@spryker-oryx/form';
import { i18n } from '@spryker-oryx/utilities';

export interface PickingFiltersAttributes {
  open?: boolean;
}

export function getFilterFields(): FormFieldDefinition[] {
  return [
    {
      id: 'sortBy',
      type: FormFieldType.RadioList,
      label: i18n('picking.filter.sort-by'),
      attributes: { direction: 'vertical' },
      options: [
        {
          value: 'deliveryDate.asc',
          text: i18n('picking.filter.earliest-pickup-time'),
        },
        {
          value: 'deliveryDate.desc',
          text: i18n('picking.filter.latest-pickup-time'),
        },
        {
          value: 'orderSize.desc',
          text: i18n('picking.filter.largest-order-size'),
        },
        {
          value: 'orderSize.asc',
          text: i18n('picking.filter.smallest-order-size'),
        },
      ],
    },
  ];
}
