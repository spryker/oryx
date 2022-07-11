import { inject } from '@spryker-oryx/injector';
import {
  EMPTY,
  filter,
  fromEvent,
  map,
  Observable,
  ReplaySubject,
  share,
} from 'rxjs';
import { RouterEvent, RouterEventType, RouterService } from '../router';
import { DefaultExperienceService } from './default-experience.service';
import { Component } from './models';

export const REQUEST_MESSAGE_TYPE = 'sf-preview-request';
export const POST_MESSAGE_TYPE = 'experience-builder-preview';

interface ExperiencePreviewEvent extends MessageEvent {
  data: {
    type?: string;
    structure?: any;
    content?: any;
    interaction?: any;
    options?: any;
    route?: any;
  };
}

export class PreviewExperienceService extends DefaultExperienceService {
  constructor(protected routerService = inject(RouterService)) {
    super();

    this.structureDataEvent$.subscribe(
      (structure: { id: string; type: string; components: Component[] }) => {
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
      }
    );

    this.contentDataEvent$.subscribe((content) => {
      if (!content?.id) {
        return;
      }

      if (!this.dataContent[content.id]) {
        this.dataContent[content.id] = new ReplaySubject<any>(1);
      }
      this.dataContent[content.id].next(content);
    });

    this.optionsDataEvent$.subscribe((options) => {
      if (!options?.id) {
        return;
      }

      if (!this.dataOptions[options.id]) {
        this.dataOptions[options.id] = new ReplaySubject<any>(1);
      }
      this.dataOptions[options.id].next(options);
    });

    this.routeDataEvent$.subscribe((route) => {
      this.routerService.go(route);
    });

    this.routerService
      .getEvents(RouterEventType.NavigationEnd)
      .subscribe((event: RouterEvent) => {
        this.routeChangeHandler(event.route);
      });
  }

  protected experiencePreviewEvent$ =
    typeof window !== 'undefined'
      ? fromEvent(window, 'message').pipe(
          filter((e: any) => e.data?.type === POST_MESSAGE_TYPE),
          share()
        )
      : EMPTY;

  protected structureDataEvent$ = this.experiencePreviewEvent$.pipe(
    filter((e) => e.data?.structure),
    map((data) => data.data.structure)
  );

  protected contentDataEvent$ = this.experiencePreviewEvent$.pipe(
    filter((e) => e.data?.content),
    map((data) => data.data.content)
  );

  protected optionsDataEvent$ = this.experiencePreviewEvent$.pipe(
    filter((e) => e.data?.options),
    map((data) => data.data.options)
  );

  protected routeDataEvent$: Observable<string> =
    this.experiencePreviewEvent$.pipe(
      filter((e) => e.data?.route),
      map((data) => data.data.route)
    );

  protected interactionDataEvent$ = this.experiencePreviewEvent$.pipe(
    filter((e) => e.data?.interaction),
    map((data) => data.data.interaction)
  );

  protected sendPostMessage(message: unknown): void {
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage(message, '*');
    }
  }

  reloadComponent(id: string): void {
    this.sendPostMessage({
      type: REQUEST_MESSAGE_TYPE,
      structure: id,
    });
  }

  reloadContent(id: string): void {
    this.sendPostMessage({
      type: REQUEST_MESSAGE_TYPE,
      content: id,
    });
  }

  reloadOptions(id: string): void {
    this.sendPostMessage({
      type: REQUEST_MESSAGE_TYPE,
      options: id,
    });
  }

  routeChangeHandler(route: string): void {
    this.sendPostMessage({
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
}
