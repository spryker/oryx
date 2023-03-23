import { inject } from '@spryker-oryx/di';
import {
  RouterEvent,
  RouterEventType,
  RouterService,
} from '@spryker-oryx/router';
import { isDefined } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  EMPTY,
  filter,
  fromEvent,
  map,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { ExperienceDataClientService } from './data-client';
import { DefaultExperienceService } from './default-experience.service';
import { Component } from './models';
import { postMessage } from './utilities';

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

    this.dataClient.sendStatic(this.staticData);
    this.dataClient.initialize().pipe(takeUntil(this.destroy$)).subscribe();

    this.structureDataEvent$.subscribe();
    this.contentDataEvent$.subscribe();
    this.optionsDataEvent$.subscribe();
    this.routeDataEvent$.subscribe();

    this.routerService
      .getEvents(RouterEventType.NavigationEnd)
      .subscribe((event: RouterEvent) => {
        this.routeChangeHandler(event.route);
      });
  }

  protected initStaticData(): Component[] {
    return this.staticData.map((component) => {
      this.processComponent(component, false);
      return component as Component;
    });
  }

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

      this.storeData('dataOptions', options.id, options);
    })
  );

  protected routeDataEvent$: Observable<string> =
    this.experiencePreviewEvent$.pipe(
      map((data) => data.data.route),
      filter(isDefined),
      tap((route) => this.routerService.navigate(route))
    );

  protected interactionDataEvent$ = this.experiencePreviewEvent$.pipe(
    map((data) => data.data.interaction),
    filter(isDefined)
  );

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

  routeChangeHandler(route: string): void {
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
  public headerEdit$ = new BehaviorSubject<boolean>(false);

  onDestroy(): void {
    this.destroy$.next();
  }
}
