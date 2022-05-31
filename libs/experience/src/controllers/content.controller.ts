import { ExperienceService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { LitElement, ReactiveController } from 'lit';
import { BehaviorSubject, filter, map, of, switchMap } from 'rxjs';
import { ContentComponentProperties } from './content-component.properties';

export class ContentController<T = unknown> implements ReactiveController {
  protected experienceContent = resolve(
    this,
    ExperienceService,
    null
  ) as ExperienceService | null;

  protected uid$ = new BehaviorSubject<string | undefined>(undefined);

  protected componentContent = new BehaviorSubject<T | undefined>(undefined);

  hostConnected(): void {
    this.uid$.next(this.host.uid);
    this.componentContent.next(this.host.content);
  }

  hostUpdated(): void {
    this.uid$.next(this.host.uid);
    this.componentContent.next(this.host.content);
  }

  constructor(protected host: LitElement & ContentComponentProperties<T>) {
    this.host.addController(this);
  }

  content$ = this.componentContent.pipe(
    switchMap((component) => {
      if (component !== undefined) {
        return of(component);
      }
      return this.uid$.pipe(
        filter((uid) => !!uid),
        switchMap(
          (uid) =>
            this.experienceContent?.getContent<{ data: T }>({ key: uid! }) ??
            of(undefined)
        ),
        map((component) => component?.data)
      );
    })
  );
}
