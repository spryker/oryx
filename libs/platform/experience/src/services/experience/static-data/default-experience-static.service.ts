import { inject } from '@spryker-oryx/di';
import { Component } from '../models';
import { ExperienceStaticData, ExperienceStaticService } from './static-data';

export class DefaultExperienceStaticService implements ExperienceStaticService {
  protected autoComponentId = 0;
  protected staticComponents!: Component[];

  constructor(protected staticData = inject(ExperienceStaticData, [])) {
    this.staticComponents = this.processData();
  }

  getData(): Component[] {
    return this.staticComponents;
  }

  protected processData(): Component[] {
    return this.staticData.flat().map((component) => {
      component.id ??= this.getAutoId();

      this.processComponent(component as Component);

      return component as Component;
    });
  }

  protected processComponent(component: Component): void {
    component.id ??= this.getAutoId();

    (component?.components ?? []).forEach((component: Component) => {
      this.processComponent(component);
    });
  }

  protected getAutoId(): string {
    return `static${this.autoComponentId++}`;
  }
}
