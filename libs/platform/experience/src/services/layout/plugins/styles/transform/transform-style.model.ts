export {};

declare global {
  export interface LayoutStylesProperties {
    /**
     * Transforms the component using this scale.
     */
    scale?: number;

    /**
     * Allows to specify the rotation of the item.
     */
    rotate?: number;
  }
}
