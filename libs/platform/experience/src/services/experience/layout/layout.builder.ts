import {
  Component,
  CompositionProperties,
  StyleProperties,
  StyleRuleSet,
} from '@spryker-oryx/experience';

export const LayoutBuilder = 'oryx.LayoutBuilder';

export interface LayoutBuilder {
  /**
   * Collects the styles for each component and screen size (by breakpoint)
   * and returns a single string containing all the styles. The styles are
   * collected in media queries and are assigned to the give component, using
   * the following structure:
   *
   * ```css
   * @media (min=500px) {
   *   [uid=comp-1]{
   *     // rules go here
   *   }
   *   [uid=comp-2]{
   *     // rules go here
   *   }
   * }
   * ```
   *
   * The concatenated styles can be used inside a `<style>` tag.
   */
  collectStyles(components: Component[]): string;

  createStylesFromOptions(id: string, rules?: StyleRuleSet[]): string;

  /**
   * Generates an class list that is driven by layout properties on the
   * composition.
   *
   * Style classes have not been our favourite choice, but applying attributes
   * to the host is not an option at SSR time.
   */
  getLayoutClasses(data?: CompositionProperties): string | undefined;

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
