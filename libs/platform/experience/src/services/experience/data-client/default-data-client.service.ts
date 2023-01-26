import {
  AppRef,
  FeatureOptionsService,
  ResourcePlugin,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { sendPostMessage } from '../utilities';
import {
  DataIds,
  ExperienceMessageType,
  MessageType,
} from './data-client.model';
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

  protected optionsInitializer$ = this.optionsService.getOptions().pipe(
    tap((option) =>
      sendPostMessage({
        type: MessageType.Options,
        [DataIds.Options]: option,
      })
    )
  );
  protected graphicsInitializer$ = of(
    this.appRef.findPlugin(ResourcePlugin)?.getResources()
  ).pipe(
    tap((resources) => {
      sendPostMessage({
        type: MessageType.Graphics,
        [DataIds.Graphics]: Object.keys(resources?.graphics ?? {}),
      });
    })
  );
  protected productsInitializer$ = fromEvent<
    ExperienceMessageType<MessageType.Query>
  >(window, 'message').pipe(
    filter((e) => e.data?.type === MessageType.Query),
    map((e) => e.data[DataIds.Query]),
    switchMap<string, Observable<ProductsSuggestion | null>>(
      (query) => this.suggestionService?.get({ query }) ?? of(null)
    ),
    tap((suggestions) => {
      sendPostMessage({
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
    this.optionsInitializer$,
    this.graphicsInitializer$,
    this.productsInitializer$
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  initialize(): Observable<unknown> {
    return this.initializer$;
  }
}
