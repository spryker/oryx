import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Observable, of, ReplaySubject, take } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONTENT_BACKEND_URL } from '../experience-tokens';
import { ExperienceService } from './experience.service';
import { Component } from './models';

export class DefaultExperienceService implements ExperienceService {
  protected dataComponent: { [key: string]: ReplaySubject<Component> } = {};
  protected dataContent: { [key: string]: ReplaySubject<any> } = {};
  protected dataOptions: { [key: string]: ReplaySubject<any> } = {};

  constructor(
    protected contentBackendUrl = inject(CONTENT_BACKEND_URL),
    protected http = inject(HttpService)
  ) {}

  protected processComponent(component: Component): void {
    const targetComponent: Component = component;
    const components = component?.components || [];

    if (targetComponent && targetComponent.id) {
      if (!this.dataComponent[targetComponent.id]) {
        this.dataComponent[targetComponent.id] = new ReplaySubject<Component>(
          1
        );
      }
      this.dataComponent[targetComponent.id].next(targetComponent);
    }

    components.forEach((component: Component) => {
      this.processComponent(component);
    });
  }

  reloadComponent(key: string): void {
    const componentsUrl = `${
      this.contentBackendUrl
    }/components/${encodeURIComponent(key)}`;

    this.http
      .get(componentsUrl)
      .pipe(
        map((res: any) => {
          this.dataComponent[key].next(res);
          this.processComponent(res);
          return res;
        }),
        catchError(() => {
          this.dataComponent[key].next({ type: '', components: [] });
          return of({});
        })
      )
      .subscribe();
  }

  reloadContent(key: string): void {
    this.getComponent({ key })
      .pipe(take(1))
      .subscribe((component) => {
        const content = component?.content ?? {};
        this.dataContent[key].next(content);
      });
  }

  reloadOptions(key: string): void {
    this.getComponent({ key })
      .pipe(take(1))
      .subscribe((component) => {
        const options = component?.options ?? {};
        this.dataOptions[key].next(options);
      });
  }

  getComponent({ key }: { key: string }): Observable<Component> {
    if (!this.dataComponent[key]) {
      this.dataComponent[key] = new ReplaySubject<Component>(1);
      this.reloadComponent(key);
    }
    return this.dataComponent[key];
  }

  getContent({ key }: { key: string }): Observable<any> {
    if (!this.dataContent[key]) {
      this.dataContent[key] = new ReplaySubject<any>(1);
      this.reloadContent(key);
    }

    return this.dataContent[key];
  }

  getOptions({ key }: { key: string }): Observable<any> {
    if (!this.dataOptions[key]) {
      this.dataOptions[key] = new ReplaySubject<any>(1);
      this.reloadOptions(key);
    }

    return this.dataOptions[key];
  }
}
