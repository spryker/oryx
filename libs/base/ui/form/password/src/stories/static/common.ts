import { Variant, VariantOptions, VariantsGroup } from '@/tools/storybook';

export enum CategoryX {
  INVISIBLE = 'Invisible',
  VISIBLE = 'Visible',
  DISABLED = 'Disabled',
  ERROR_MESSAGE = 'Error message',
  ERROR_WITHOUT_MESSAGE = 'Error without message',
}

export interface PasswordInputVariantOptions extends VariantOptions {
  floatLabel?: boolean;
  label?: string;
  value?: string | number;
  disabled?: boolean;
  visible?: boolean;
  errorMessage?: string;
  hasError?: boolean;
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
  {
    categoryX: CategoryX.ERROR_MESSAGE,
    categoryY: '',
    options: {
      errorMessage: 'Error message',
    },
  },
  {
    categoryX: CategoryX.ERROR_WITHOUT_MESSAGE,
    categoryY: '',
    options: {
      hasError: true,
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
