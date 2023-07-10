import {
  extendVariants,
  Variant,
  VariantOptions,
  VariantsGroup,
} from '@/tools/storybook';

export const enum CategoryX {
  Default = 'default',
  Hovered = 'hovered',
  Active = 'active',
  Focused = 'focused',
  Disabled = 'disabled',
}

export interface QuantityInputVariantOptions extends VariantOptions {
  className?: string;
  isDisabled?: boolean;
}

export interface InputVariant extends Variant {
  options: QuantityInputVariantOptions;
}

export enum CategoryY {
  Decrease = 'decrease',
  Input = 'input',
  Increase = 'increase',
}

export const getInputVariants = (
  categoryY: CategoryY,
  options?: QuantityInputVariantOptions
): InputVariant[] => {
  return extendVariants(baseInputVariants, {
    categoryY,
    options,
  });
};

export const baseInputVariants: InputVariant[] = [
  {
    categoryX: CategoryX.Default,
    categoryY: '',
    options: {},
  },
  {
    categoryX: CategoryX.Hovered,
    categoryY: '',
    options: {
      className: 'pseudo-hover',
    },
  },
  {
    categoryX: CategoryX.Active,
    categoryY: '',
    options: {
      className: 'pseudo-active',
    },
  },
  {
    categoryX: CategoryX.Focused,
    categoryY: '',
    options: {
      className: 'pseudo-focus-visible pseudo-focus-within',
    },
  },
  {
    categoryX: CategoryX.Disabled,
    categoryY: '',
    options: {
      isDisabled: true,
    },
  },
];

export const groups: VariantsGroup<{
  min: number;
  max: number;
  value: number;
}>[] = [
  {
    title: 'Default',
    options: {
      min: 0,
      max: 2,
      value: 1,
    },
  },
  {
    title: 'Error',
    options: {
      min: 0,
      max: 2,
      value: 3,
    },
  },
];
