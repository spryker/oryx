import { resolve } from '@spryker-oryx/di';
import { Component, ContentComponentProperties, ExperienceService } from '@spryker-oryx/experience';
import { ObserveController } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { map, Observable, switchMap } from 'rxjs';

export class ComponentsController {
  protected observe: ObserveController<LitElement & ContentComponentProperties<unknown>>;

  constructor(protected host: LitElement) {
    this.observe = new ObserveController(host);
  }

  protected experienceService = resolve(ExperienceService);

  getComponents(): Observable<Component[]> {
    return this.observe.get('uid').pipe(
        switchMap(uid => this.experienceService.getComponent({ uid })),
        map((component: Component) => component?.components ?? [])
    )};
}
