import {
  extendVariants,
  initMutationObserverForComponent,
  Variant,
  VariantOptions,
} from '@/tools/storybook';

export enum CategoryX {
  DEFAULT = 'Default',
  HOVERED = 'Hovered',
  FOCUSED = 'Focused',
  REQUIRED = 'Required',
  DISABLED = 'Disabled',
  ERROR = 'Error',
  ERROR_WITHOUT_MESSAGE = 'Error without message',
}

export interface InputVariantOptions extends VariantOptions {
  className?: string;
  errorMessage?: string;
  isDisabled?: boolean;
  hasError?: boolean;
  floatLabel?: boolean;
  required?: boolean;
  label?: string;
  value?: string | number;
}

export interface InputVariant extends Variant {
  options: InputVariantOptions;
}

export enum CategoryY {
  EMPTY = 'Empty',
  FILLED = 'Filled',
}

export const getInputVariants = (
  options?: InputVariantOptions
): InputVariant[] => {
  return extendVariants(baseInputVariants, {
    categoryY:
      options?.value !== undefined ? CategoryY.FILLED : CategoryY.EMPTY,
    options,
  });
};

export const baseInputVariants: InputVariant[] = [
  {
    categoryX: CategoryX.DEFAULT,
    categoryY: '',
    options: {},
  },
  {
    categoryX: CategoryX.HOVERED,
    categoryY: '',
    options: {
      className: 'pseudo-hover',
    },
  },
  {
    categoryX: CategoryX.FOCUSED,
    categoryY: '',
    options: {
      className: 'pseudo-focus-within',
    },
  },
  {
    categoryX: CategoryX.REQUIRED,
    categoryY: '',
    options: {
      required: true,
    },
  },
  {
    categoryX: CategoryX.DISABLED,
    categoryY: '',
    options: {
      isDisabled: true,
    },
  },
  {
    categoryX: CategoryX.ERROR,
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

export const setInputMutationObserver = (): void => {
  initMutationObserverForComponent({
    targetComponent: 'oryx-input',
    targetSelector: '.control',
    sourceSelector: 'input',
  });
};
