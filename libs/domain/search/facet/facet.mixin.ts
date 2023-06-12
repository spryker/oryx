import { Type } from '@spryker-oryx/di';
import { observe } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import {
  SearchFacetComponentAttributes,
  FacetController,
  SingleMultiFacet,
} from './index';

export declare class FacetComponent {
  controller: FacetController;
  facet$: Observable<[SingleMultiFacet | null, SearchFacetComponentAttributes]>;
}

export const FacetComponentMixin = (): Type<
  LitElement & FacetComponent & SearchFacetComponentAttributes
> => {
  class FacetComponent extends LitElement {
    controller = new FacetController(this);

    @property() name?: string;
    @property({ type: Boolean }) open?: boolean;
    @property({ type: Boolean }) multi = false;
    @property({ type: Number }) renderLimit = 5;
    @property({ type: Number }) minForSearch = 13;
    @property({ type: Boolean }) enableClear = true;

    @observe([
      'name',
      'open',
      'multi',
      'renderLimit',
      'minForSearch',
      'enableClear',
    ])
    protected props$ = new BehaviorSubject([
      this.name,
      this.open,
      this.multi,
      this.renderLimit,
      this.minForSearch,
      this.enableClear,
    ] as const).pipe(
      map(([name, open, multi, renderLimit, minForSearch, enableClear]) => ({
        name,
        open,
        multi,
        renderLimit,
        minForSearch,
        enableClear,
      }))
    );

    facet$ = combineLatest([this.controller.getFacet(), this.props$]);
  }

  return FacetComponent;
};
