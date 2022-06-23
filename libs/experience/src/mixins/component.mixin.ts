import { Type } from '@spryker-oryx/typescript-utils';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ContentComponentProperties } from '..';

export const ComponentMixin = <A>(): Type<
  LitElement & ContentComponentProperties<A>
> => {
  class Component extends LitElement implements ContentComponentProperties<A> {
    @property() uid?: string;
    @property({ type: Object }) content?: A;
  }
  return Component as Type<LitElement & ContentComponentProperties<A>>;
};
