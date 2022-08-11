import { Type } from '@spryker-oryx/typescript-utils';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ContentComponentProperties } from '../index';

export const ComponentMixin = <A, B = A>(): Type<
  LitElement & ContentComponentProperties<A, B>
> => {
  class Component
    extends LitElement
    implements ContentComponentProperties<A, B>
  {
    @property() uid?: string;
    @property({ type: Object }) content?: A;
    @property({ type: Object }) options?: B;
  }
  return Component as Type<LitElement & ContentComponentProperties<A, B>>;
};
