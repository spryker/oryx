import { Type } from '@spryker-oryx/di';
import {
  FacetComponentAttributes,
  SingleMultiFacet,
} from '@spryker-oryx/search/facet';
import { observe } from '@spryker-oryx/utilities';
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

    @observe(['name', 'open', 'multi', 'renderLimit', 'minForSearch'])
    protected props$ = new BehaviorSubject([
      this.name,
      this.open,
      this.multi,
      this.renderLimit,
      this.minForSearch,
    ] as const).pipe(
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
