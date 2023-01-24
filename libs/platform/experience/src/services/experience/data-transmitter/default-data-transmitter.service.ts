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
} from './data-transmitter.model';
import { DataTransmitterService } from './data-transmitter.service';

export class DefaultDataTransmitterService implements DataTransmitterService {
  constructor(
    protected appRef = inject(AppRef),
    protected optionsService = inject(FeatureOptionsService),
    // TODO: change it to InjectableSuggestion
    protected suggestionService = inject('oryx.SuggestionService', null)
  ) {}

  protected optionsInitializer$ = this.optionsService.getOptions().pipe(
    tap((option) =>
      sendPostMessage({
        type: MessageType.RequestOptions,
        [DataIds.Options]: option,
      })
    )
  );
  protected graphicsInitializer$ = of(
    this.appRef.findPlugin(ResourcePlugin)?.getResources()
  ).pipe(
    tap((resources) => {
      sendPostMessage({
        type: MessageType.RequestGraphics,
        [DataIds.Graphics]: Object.keys(resources?.graphics ?? {}),
      });
    })
  );
  protected productsInitializer$ = fromEvent<
    ExperienceMessageType<MessageType.ResponseQuery>
  >(window, 'message').pipe(
    filter((e) => e.data?.type === MessageType.ResponseQuery),
    map((e) => e.data[DataIds.Query]),
    switchMap((query) => this.suggestionService?.get({ query }) ?? of(null)),
    tap((suggestions: any) =>
      sendPostMessage({
        type: MessageType.RequestProduct,
        [DataIds.Products]: (suggestions?.products ?? []).map(
          ({ name, sku }: any) => ({
            name,
            sku,
          })
        ),
      })
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  protected initializer$ = merge(
    this.optionsInitializer$,
    this.graphicsInitializer$,
    this.productsInitializer$
  );

  initialize(): Observable<unknown> {
    return this.initializer$;
  }
}
