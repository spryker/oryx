import { HeadingTag } from '@spryker-oryx/ui/heading';

export {};

declare global {
  export interface LayoutStylesProperties {
    /**
     * Specifies the typography tag, which is one of the available heading tags.
     * The typography is applied to the component and all it's sub components, including those components
     * with a shadow dom, since typography is inherited in shadow dom.
     */
    typography?: HeadingTag | string;
  }
}
