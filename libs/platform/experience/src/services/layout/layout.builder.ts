import {
  Component,
  CompositionProperties,
  StyleProperties,
  StyleRuleSet,
} from '../../models';

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

  createStylesFromOptions(rules?: StyleRuleSet[], id?: string): string;

  /**
   * Generates an list of layout values that is driven by layout properties on the
   * composition.
   */
  getLayoutMarkers(data?: CompositionProperties): string | undefined;

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
