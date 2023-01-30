import {
  AppRef,
  ComponentsPlugin,
  FeatureOptionsService,
  ResourcePlugin,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  distinctUntilChanged,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { optionsKey } from '../../../decorators';
import { catchMessage, postMessage } from '../utilities';
import { DataIds, MessageType } from './data-client.model';
import { ExperienceDataClientService } from './data-client.service';

interface ProductsSuggestion {
  products: {
    name?: string;
    sku?: string;
  }[];
}

export class DefaultExperienceDataClientService
  implements ExperienceDataClientService
{
  constructor(
    protected appRef = inject(AppRef),
    protected optionsService = inject(FeatureOptionsService),
    protected suggestionService = inject('oryx.SuggestionService', null)
  ) {}

  protected componentType$ = catchMessage(
    MessageType.ComponentType,
    DataIds.ComponentType
  ).pipe(
    distinctUntilChanged(),
    map(
      (type) =>
        [
          type,
          this.appRef.findPlugin(ComponentsPlugin)?.getComponentClass(type),
        ] as const
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  protected options$ = this.componentType$.pipe(
    tap(([type, componentClass]) => {
      if (!componentClass) {
        return;
      }

      const options = {
        ...componentClass[optionsKey],
        ...this.optionsService.getFeatureOptions(type),
      };

      postMessage({
        type: MessageType.Options,
        [DataIds.Options]: options,
      });
    })
  );
  protected graphics$ = of(
    this.appRef.findPlugin(ResourcePlugin)?.getResources()
  ).pipe(
    tap((resources) => {
      postMessage({
        type: MessageType.Graphics,
        [DataIds.Graphics]: Object.keys(resources?.graphics ?? {}),
      });
    })
  );
  protected products$ = catchMessage(MessageType.Query, DataIds.Query).pipe(
    switchMap<string, Observable<ProductsSuggestion | null>>(
      (query) => this.suggestionService?.get({ query }) ?? of(null)
    ),
    tap((suggestions) => {
      postMessage({
        type: MessageType.Products,
        [DataIds.Products]: (suggestions?.products ?? []).map(
          ({ name, sku }) => ({
            name,
            sku,
          })
        ),
      });
    })
  );
  protected initializer$ = merge(
    this.options$,
    this.graphics$,
    this.products$
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  initialize(): Observable<unknown> {
    return this.initializer$;
  }
}
