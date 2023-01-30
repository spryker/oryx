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
  ReplaySubject,
  shareReplay,
  tap,
} from 'rxjs';
import { DefaultExperienceService } from './default-experience.service';
import { Component } from './models';
import { postMessage } from './utilities';

export const REQUEST_MESSAGE_TYPE = 'sf-preview-request';
export const POST_MESSAGE_TYPE = 'experience-builder-preview';

interface ExperiencePreviewData {
  type?: string;
  structure?: {
    id: string;
    type: string;
    components: Component[];
  };
  content?: any;
  interaction?: any;
  options?: any;
  route?: any;
}
export type ExperiencePreviewEvent = MessageEvent<ExperiencePreviewData>;

export class PreviewExperienceService extends DefaultExperienceService {
  constructor(protected routerService = inject(RouterService)) {
    super();

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
      if (!this.dataComponent[structure.id]) {
        this.dataComponent[structure.id] = new ReplaySubject<Component>(1);
      }

      this.dataComponent[structure.id].next(structure);

      if (Array.isArray(structure.components)) {
        structure.components.forEach((item: Component) => {
          if (item.id) {
            if (!this.dataComponent[item.id]) {
              this.dataComponent[item.id] = new ReplaySubject<Component>(1);
            }

            this.dataComponent[item.id].next(item);
          }
        });
        this.processComponent(structure);
      }
    })
  );

  protected contentDataEvent$ = this.experiencePreviewEvent$.pipe(
    map((data) => data.data.content),
    filter(isDefined),
    tap((content) => {
      if (!content?.id) {
        return;
      }

      if (!this.dataContent[content.id]) {
        this.dataContent[content.id] = new ReplaySubject<any>(1);
      }
      this.dataContent[content.id].next(content);
    })
  );

  protected optionsDataEvent$ = this.experiencePreviewEvent$.pipe(
    map((data) => data.data.options),
    filter(isDefined),
    tap((options) => {
      if (!options?.id) {
        return;
      }

      if (!this.dataOptions[options.id]) {
        this.dataOptions[options.id] = new ReplaySubject<any>(1);
      }
      this.dataOptions[options.id].next(options);
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

  reloadComponent(id: string): void {
    postMessage({
      type: REQUEST_MESSAGE_TYPE,
      structure: id,
    });
  }

  reloadContent(id: string): void {
    postMessage({
      type: REQUEST_MESSAGE_TYPE,
      content: id,
    });
  }

  reloadOptions(id: string): void {
    postMessage({
      type: REQUEST_MESSAGE_TYPE,
      options: id,
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
}
