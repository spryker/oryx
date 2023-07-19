import { Type } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ContentComponentProperties } from '../index';

/** @deprecated Use ContentMixin instead */
export const ComponentMixin = <A, B = unknown>(): Type<
  LitElement & ContentComponentProperties<A, B>
> => {
  class Component
    extends LitElement
    implements ContentComponentProperties<A, B>
  {
    @property() uid?: string;
    @property({ type: Object, reflect: true }) content?: B;
    @property({ type: Object, reflect: true }) options?: A;
  }
  return Component as Type<LitElement & ContentComponentProperties<A, B>>;
};
