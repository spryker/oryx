import { Type } from '@spryker-oryx/injector';
import {
  FacetComponentAttributes,
  SingleMultiFacet,
} from '@spryker-oryx/search/facet';
import { observe } from '@spryker-oryx/utilities/lit-rxjs';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { FacetController } from '../../facet/src/controllers';

export declare class FacetComponent {
  controller: FacetController;
  facet$: Observable<[SingleMultiFacet | null, FacetComponentAttributes]>;
}

export const FacetComponentMixin = (): Type<
  LitElement & FacetComponent & FacetComponentAttributes
> => {
  class FacetComponent extends LitElement {
    controller = new FacetController(this);

    @property() name?: string;
    @property({ type: Boolean }) open?: boolean;
    @property({ type: Boolean }) multi = false;
    @property({ type: Number }) renderLimit = 5;
    @property({ type: Number }) minForSearch = 13;

    @observe()
    protected name$ = new BehaviorSubject(this.name);
    @observe()
    protected open$ = new BehaviorSubject(this.open);
    @observe()
    protected multi$ = new BehaviorSubject(this.multi);
    @observe()
    protected renderLimit$ = new BehaviorSubject(this.renderLimit);
    @observe()
    protected minForSearch$ = new BehaviorSubject(this.minForSearch);

    protected props$ = combineLatest([
      this.name$,
      this.open$,
      this.multi$,
      this.renderLimit$,
      this.minForSearch$,
    ]).pipe(
      map(([name, open, multi, renderLimit, minForSearch]) => ({
        name,
        open,
        multi,
        renderLimit,
        minForSearch,
      }))
    );

    facet$ = combineLatest([this.controller.getFacet(), this.props$]);
  }

  return FacetComponent;
};
