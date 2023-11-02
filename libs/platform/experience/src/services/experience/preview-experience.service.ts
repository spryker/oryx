import { inject } from '@spryker-oryx/di';
import {
  BASE_ROUTE,
  RouterEventType,
  RouterService,
} from '@spryker-oryx/router';
import { isDefined } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  filter,
  fromEvent,
  map,
  merge,
  shareReplay,
  takeUntil,
  tap,
} from 'rxjs';
import { Component } from '../../models';
import {
  ExperienceDataClientService,
  MessageType,
  postMessage,
} from '../data-client';
import { DefaultExperienceService } from './default-experience.service';

export const REQUEST_MESSAGE_TYPE = 'sf-preview-request';
export const POST_MESSAGE_TYPE = 'experience-builder-preview';

interface ExperiencePreviewData {
  type?: string;
  structure?: Component;
  content?: any;
  interaction?: any;
  options?: any;
  route?: string;
}
export type ExperiencePreviewEvent = MessageEvent<ExperiencePreviewData>;

export class PreviewExperienceService extends DefaultExperienceService {
  constructor(
    protected routerService = inject(RouterService),
    protected dataClient = inject(ExperienceDataClientService)
  ) {
    super();
    this.sendExperienceData();
    merge(
      this.dataClient.initialize(),
      this.structureDataEvent$,
      this.contentDataEvent$,
      this.optionsDataEvent$,
      this.routeDataEvent$,
      this.routerService.getEvents(RouterEventType.NavigationEnd).pipe(
        tap((event) => {
          this.routeChangeHandler(event.route);
        })
      )
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  protected baseRoute = inject(BASE_ROUTE, null);

  protected destroy$ = new Subject<void>();

  protected experiencePreviewEvent$ =
    typeof window !== 'undefined'
      ? fromEvent<ExperiencePreviewEvent>(window, 'message').pipe(
          filter((e) => e.data?.type === POST_MESSAGE_TYPE),
          shareReplay({ bufferSize: 1, refCount: true })
        )
      : EMPTY;

  protected structureDataEvent$ = this.experiencePreviewEvent$.pipe(
    map((data) => data.data?.structure),
    filter(isDefined),
    tap((structure) => {
      this.storeData('dataRoutes', structure.meta?.route, structure.id);
      this.processComponent(structure);
    })
  );

  protected contentDataEvent$ = this.experiencePreviewEvent$.pipe(
    map((data) => data.data.content),
    filter(isDefined),
    tap((content) => {
      if (!content?.id) {
        return;
      }

      this.storeData('dataContent', content.id, content);
    })
  );

  protected optionsDataEvent$ = this.experiencePreviewEvent$.pipe(
    map((data) => data.data.options),
    filter(isDefined),
    tap((options) => {
      if (!options?.id) {
        return;
      }

      this.storeData('dataOptions', options.id, options.data);
    })
  );

  protected routeDataEvent$: Observable<string> =
    this.experiencePreviewEvent$.pipe(
      map((data) => data.data.route),
      filter(isDefined),
      map((route) => (this.baseRoute ? this.baseRoute + route : route)),
      tap((route) => this.routerService.navigate(route))
    );

  protected interactionDataEvent$ = this.experiencePreviewEvent$.pipe(
    map((data) => data.data.interaction),
    filter(isDefined)
  );

  protected initExperienceData(): void {
    this.experienceData = this.experienceDataService.getData();
  }

  protected reloadComponent(uid: string): void {
    postMessage({
      type: REQUEST_MESSAGE_TYPE,
      structure: uid,
    });
  }

  protected reloadComponentByRoute(route: string): void {
    postMessage({
      type: REQUEST_MESSAGE_TYPE,
      route,
    });
  }

  protected reloadContent(uid: string): void {
    postMessage({
      type: REQUEST_MESSAGE_TYPE,
      content: uid,
    });
  }

  protected reloadOptions(uid: string): void {
    postMessage({
      type: REQUEST_MESSAGE_TYPE,
      options: uid,
    });
  }

  protected sendExperienceData(): void {
    postMessage({
      type: MessageType.Static,
      data: this.experienceData,
    });
  }

  routeChangeHandler(route: string): void {
    if (this.baseRoute && route.startsWith(this.baseRoute)) {
      route = route.replace(this.baseRoute, '');
    }

    postMessage({
      type: REQUEST_MESSAGE_TYPE,
      route,
    });
  }

  getRouteData(): Observable<string> {
    return this.routeDataEvent$;
  }

  getInteractionData(): Observable<any> {
    return this.interactionDataEvent$;
  }

  /**
   * Temporary flag for storing the information about header/footer editing
   */
  headerEdit$ = new BehaviorSubject(false);

  onDestroy(): void {
    this.destroy$.next();
  }
}
