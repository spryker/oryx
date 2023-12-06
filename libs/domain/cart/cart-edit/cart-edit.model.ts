import { FormFieldDefinition, FormFieldOption, FormFieldType } from '@spryker-oryx/form';
import { PriceModes } from '@spryker-oryx/site';
import { i18n } from '@spryker-oryx/utilities';

export const priceModes: PriceModes[] = [PriceModes.GrossMode, PriceModes.NetMode];

export const fields = (
    _i18n: typeof i18n,
    currencyOptions: FormFieldOption[] = [],
    priceModeOptions: FormFieldOption[] = [],
): FormFieldDefinition[] => ([
  {
    id: 'name',
    type: FormFieldType.Text,
    label: _i18n('cart.edit.name'),
    placeholder: _i18n('cart.edit.name.placeholder'),
    required: true,
    width: 100,
  },
  {
    id: 'currency',
    type: FormFieldType.Select,
    label: _i18n('currency'),
    required: true,
    options: currencyOptions
  },
  {
    id: 'priceMode',
    type: FormFieldType.Select,
    label: _i18n('card-edit.price-mode'),
    required: true,
    options: priceModeOptions
  },
]);
