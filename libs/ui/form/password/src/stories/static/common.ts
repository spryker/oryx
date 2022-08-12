import { Variant, VariantOptions } from '../../../../../utilities';
import { VariantsGroup } from '../../../../../utilities/storybook/variants/variants-group';

export enum CategoryX {
  INVISIBLE = 'Invisible',
  VISIBLE = 'Visible',
  DISABLED = 'Disabled',
}

export interface PasswordInputVariantOptions extends VariantOptions {
  floatLabel?: boolean;
  label?: string;
  value?: string | number;
  disabled?: boolean;
  visible?: boolean;
}

export interface PasswordInputVariant extends Variant {
  options: PasswordInputVariantOptions;
}

export const basePasswordInputVariants: PasswordInputVariant[] = [
  {
    categoryX: CategoryX.INVISIBLE,
    categoryY: '',
    options: {},
  },
  {
    categoryX: CategoryX.VISIBLE,
    categoryY: '',
    options: {
      visible: true,
    },
  },
  {
    categoryX: CategoryX.DISABLED,
    categoryY: '',
    options: {
      disabled: true,
    },
  },
];

export const groups: VariantsGroup<PasswordInputVariantOptions>[] = [
  {
    title: 'Standard label',
    options: {
      floatLabel: false,
    },
  },
  {
    title: 'Floating label',
    options: {
      floatLabel: true,
    },
  },
];
