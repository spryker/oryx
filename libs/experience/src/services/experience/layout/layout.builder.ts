import {
  CompositionProperties,
  StyleProperties,
} from '@spryker-oryx/experience';

export const LayoutBuilder = 'FES.LayoutBuilder';

export interface LayoutBuilder {
  /**
   * Generates an class list that is driven by layout properties on the
   * composition.
   *
   * Style classes have not been our favourite choice, but applying attributes
   * to the host is not an option at SSR time.
   */
  getLayoutClasses(data?: Partial<CompositionProperties>): string | undefined;

  /**
   * Generates an inline style, driven by the style properties
   * from the data.
   */
  getLayoutStyles(data?: StyleProperties): string | undefined;
}

declare global {
  interface InjectionTokensContractMap {
    [LayoutBuilder]: LayoutBuilder;
  }
}
