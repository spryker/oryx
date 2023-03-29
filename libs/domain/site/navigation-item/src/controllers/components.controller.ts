import { resolve } from '@spryker-oryx/di';
import { Component, ComponentsRegistryService, ContentComponentProperties, ExperienceService } from '@spryker-oryx/experience';
import { ObserveController } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult } from 'lit';
import { map, Observable, switchMap } from 'rxjs';

export class ComponentsController {
  protected observe: ObserveController<LitElement & ContentComponentProperties<unknown>>;

  constructor(protected host: LitElement) {
    this.observe = new ObserveController(host);
  }

  protected experienceService = resolve(ExperienceService);
  protected registryService = resolve(ComponentsRegistryService)

  getComponents(): Observable<Component[]> {
    return this.observe.get('uid').pipe(
        switchMap(uid => this.experienceService.getComponent({ uid })),
        map((component: Component) => component?.components ?? [])
    )};

  resolveComponents(components?: Component[]): (TemplateResult | undefined)[] {
    if (!components) {
        return [];
    }

    return components.map(component => this.registryService.resolveTemplate(
      component.type,
      component.id,
    ));
  }
}
