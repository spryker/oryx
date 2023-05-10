import { FormFieldDefinition, FormFieldType } from "@spryker-oryx/form";
import { i18n } from "@spryker-oryx/utilities";

export interface FiltersAttributes {
    open?: boolean;
}

export const SUBMIT_EVENT = 'oryx.submit';

export const fields: FormFieldDefinition[] = [
    {
      id: 'sortBy',
      type: FormFieldType.RadioList,
      label: i18n('picking.filter.sort-by') as string,
      attributes: { direction: 'vertical' },
      options: [
        {
            value: 'requestedDeliveryDate.asc',
            text: 'Earliest pick-up time',
          },
          {
            value: 'requestedDeliveryDate.desc',
            text: 'Latest pick-up time',
          },
          {
            value: 'itemsCount.desc',
            text: 'Largest order size',
          },
          {
            value: 'itemsCount.asc',
            text: 'Smallest order size',
          },
      ]
    },
  ];
  