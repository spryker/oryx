import {
  AppRef,
  ComponentsPlugin,
  FeatureOptionsService,
  ResourcePlugin,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { map, merge, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { modelKey, optionsKey } from '../../../decorators';
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

  protected component$ = catchMessage(
    MessageType.ComponentType,
    DataIds.ComponentType
  ).pipe(
    map((type) => [type, this.appRef.findPlugin(ComponentsPlugin)] as const),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  protected model$ = this.component$.pipe(
    tap(([type, componentPlugin]) => {
      if (!componentPlugin) {
        return;
      }

      const model = componentPlugin.getComponentModel(type)?.[modelKey];

      postMessage({
        type: MessageType.Model,
        [DataIds.Model]: model,
      });
    })
  );
  protected options$ = this.component$.pipe(
    tap(([type, componentPlugin]) => {
      if (!componentPlugin) {
        return;
      }

      const options = {
        ...componentPlugin.getComponentClass(type)?.[optionsKey],
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
    this.products$,
    this.model$
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  initialize(): Observable<unknown> {
    return this.initializer$;
  }
}
