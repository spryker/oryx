import { ComponentGroup, ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { CartTotalsComponent } from './totals.component';

export const cartTotalsComponentSchema: ContentComponentSchema<CartTotalsComponent> =
  {
    name: 'Cart totals',
    group: ComponentGroup.Cart,
    icon: '<path d="M5.46383 9.93009H15.1625V11.3138H5.46383V9.93009ZM5.46383 14.7732H15.1625V16.1569H5.46383V14.7732ZM5.46383 19.6163H15.1625V21H5.46383V19.6163ZM2 9.93009H3.39727V11.3138H2V9.93009ZM2 14.7732H3.39727V16.1569H2V14.7732ZM3.39727 19.6163V21H2V19.6163H3.39727ZM18.9528 2V5.13983H22V7.13644H18.9528V10.2763H16.8892V7.13644H13.8259V5.13983H16.8892V2H18.9528Z" />',
    options: {
      enableSubtotal: { type: FormFieldType.Boolean },
      enableDelivery: { type: FormFieldType.Boolean },
      enableExpense: { type: FormFieldType.Boolean },
      enableDiscounts: { type: FormFieldType.Boolean },
      enableTaxAmount: { type: FormFieldType.Boolean },
      enableTaxMessage: { type: FormFieldType.Boolean },
      deliveryMessage: { type: FormFieldType.Text },
      discountRowsAppearance: {
        type: FormFieldType.Select,
        options: [
          { value: 'none' },
          { value: 'inline' },
          { value: 'collapsed' },
          { value: 'expanded' },
        ],
      },
    },
  };
