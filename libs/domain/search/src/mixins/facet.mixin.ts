import { Type } from '@spryker-oryx/di';
import {
  FacetComponentAttributes,
  FacetController,
  SingleMultiFacet,
} from '@spryker-oryx/search/facet';
import { observe } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

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
    @property({ type: Boolean }) enableClearAction = true;

    @observe([
      'name',
      'open',
      'multi',
      'renderLimit',
      'minForSearch',
      'enableClearAction',
    ])
    protected props$ = new BehaviorSubject([
      this.name,
      this.open,
      this.multi,
      this.renderLimit,
      this.minForSearch,
      this.enableClearAction,
    ] as const).pipe(
      map(
        ([
          name,
          open,
          multi,
          renderLimit,
          minForSearch,
          enableClearAction,
        ]) => ({
          name,
          open,
          multi,
          renderLimit,
          minForSearch,
          enableClearAction,
        })
      )
    );

    facet$ = combineLatest([this.controller.getFacet(), this.props$]);
  }

  return FacetComponent;
};
