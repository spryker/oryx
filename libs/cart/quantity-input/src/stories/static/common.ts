import {
  extendVariants,
  Variant,
  VariantOptions,
} from '@spryker-oryx/ui/utilities';

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

export const enum CategoryY {
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
