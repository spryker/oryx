import { extendVariants, PseudoStates, Variant } from '../index';

export enum CategoryX {
  DEFAULT = 'Default',
  DEFAULT_WITH_SUBTEXT = 'With subtext',
  HOVERED = 'Hovered',
  FOCUSED = 'Focused',
  DISABLED = 'Disabled',
  ERROR = 'Error',
  ERROR_MESSAGE = 'Error message',
  ERROR_MESSAGE_WITH_SUBTEXT = 'Error message with subtext',
  CUSTOM_ERROR_MESSAGE = 'Custom error message',
}

export const generateGroupItemVariants = <T extends Variant>(
  basicVariants: T[]
): T[] => {
  return [
    ...basicVariants,
    ...extendVariants(basicVariants, {
      categoryX: CategoryX.DEFAULT_WITH_SUBTEXT,
      options: {
        subtext: 'Subtext',
      },
    }),
    ...extendVariants(basicVariants, {
      categoryX: CategoryX.HOVERED,
      options: {
        className: PseudoStates.HOVER,
      },
    }),
    ...extendVariants(basicVariants, {
      categoryX: CategoryX.FOCUSED,
      options: {
        className: PseudoStates.FOCUS_VISIBLE,
      },
    }),
    ...extendVariants(basicVariants, {
      categoryX: CategoryX.DISABLED,
      options: {
        disabled: true,
      },
    }),
    ...extendVariants(basicVariants, {
      categoryX: CategoryX.ERROR,
      options: {
        hasError: true,
      },
    }),
    ...extendVariants(basicVariants, {
      categoryX: CategoryX.ERROR_MESSAGE,
      options: {
        errorMessage: 'Error validation text',
      },
    }),
    ...extendVariants(basicVariants, {
      categoryX: CategoryX.ERROR_MESSAGE_WITH_SUBTEXT,
      options: {
        subtext: 'Subtext',
        errorMessage: 'Error validation text',
      },
    }),
    ...extendVariants(basicVariants, {
      categoryX: CategoryX.CUSTOM_ERROR_MESSAGE,
      options: {
        customErrorMessage: 'Custom error validation text',
      },
    }),
  ];
};
