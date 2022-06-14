import { ExperienceService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { LitElement, ReactiveController } from 'lit';
import { map, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { ContentComponentProperties } from './content-component.properties';

export class ContentController<T = unknown> implements ReactiveController {
  protected experienceContent = resolve(
    this,
    ExperienceService,
    null
  ) as ExperienceService | null;

  protected uid$ = new Subject<string | undefined>();

  protected componentContent = new Subject<T | undefined>();

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

  content$: Observable<T | undefined> = this.componentContent.pipe(
    startWith(this.host?.content),
    switchMap((content) => {
      if (content !== undefined) {
        return of(content);
      }
      return this.uid$.pipe(
        startWith(this.host.uid),
        switchMap((key) =>
          key && this.experienceContent
            ? this.experienceContent
                .getContent<{ data: T }>({ key })
                .pipe(map((component) => component?.data))
            : of(undefined)
        )
      );
    })
  );
}
