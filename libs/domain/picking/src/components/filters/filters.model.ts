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
            value: '1',
            // {
            //   sortBy: 'requestedDeliveryDate',
            //   sort: StorageSortDirection.ASC,
            // }
            text: 'Earliest Pickup Time',
          },
          {
            value: '2',
            // {
            //   sortBy: 'requestedDeliveryDate',
            //   sort: StorageSortDirection.DESC,
            // },
            text: 'Latest Pickup Time',
          },
          {
            value: '3',
            // {
            //   sortBy: 'itemsCount',
            //   sort: StorageSortDirection.DESC,
            // },
            text: 'Largest Order Size',
          },
          {
            value: '4',
            // {
            //   sortBy: 'itemsCount',
            //   sort: StorageSortDirection.ASC,
            // },
            text: 'Smallest Order Size',
          },
      ]
    },
  ];
  