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
import { RouterEvent, RouterEventType } from '../router';
import { Services } from '../services';
import { ExperienceService } from './experience.service';
import { Component } from './models';

const REQUEST_MESSAGE_TYPE = 'vsf-preview-request';
const POST_MESSAGE_TYPE = 'experience-builder-preview';

/* TODO: move it from current */
export class ExperiencePreviewService extends ExperienceService {
  constructor(protected routerService = inject(Services.Router)) {
    super();

    this.structureDataEvent$.subscribe(
      (structure: { id: string; type: string; components: Component[] }) => {
        if (!this.dataStructure[structure.id]) {
          this.dataStructure[structure.id] = new ReplaySubject<Component>(1);
        }

        this.dataStructure[structure.id].next(structure);

        if (Array.isArray(structure.components)) {
          structure.components.forEach((item: Component) => {
            if (item.id) {
              if (!this.dataStructure[item.id]) {
                this.dataStructure[item.id] = new ReplaySubject<Component>(1);
              }

              this.dataStructure[item.id].next(item);
            }
          });
          this.processStructure(structure.components);
        }
      }
    );

    this.contentDataEvent$.subscribe((content) => {
      if (content && content.id) {
        if (!this.dataContent[content.id]) {
          this.dataContent[content.id] = new ReplaySubject<any>(1);
        }
        this.dataContent[content.id].next(content);
      }
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
    filter((e: any) => e.data?.structure),
    map((data) => data.data.structure)
  );

  protected contentDataEvent$ = this.experiencePreviewEvent$.pipe(
    filter((e: any) => e.data?.content),
    map((data) => data.data.content)
  );

  protected routeDataEvent$: Observable<string> =
    this.experiencePreviewEvent$.pipe(
      filter((e: any) => e.data?.route),
      map((data) => data.data.route)
    );

  protected interactionDataEvent$ = this.experiencePreviewEvent$.pipe(
    filter((e: any) => e.data?.interaction),
    map((data) => data.data.interaction)
  );

  protected sendPostMessage(message: unknown): void {
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage(message, '*');
    }
  }

  reloadStructure(key: string): void {
    this.sendPostMessage({
      type: REQUEST_MESSAGE_TYPE,
      structure: key,
    });
  }

  reloadContent(key: string): void {
    this.sendPostMessage({
      type: REQUEST_MESSAGE_TYPE,
      content: key,
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
