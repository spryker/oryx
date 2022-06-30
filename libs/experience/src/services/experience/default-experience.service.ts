import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Observable, of, ReplaySubject } from 'rxjs';
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

  protected processComponent(components: Component[]): void {
    const targetComponent = components.find((component: Component) =>
      component.components ? component.id : undefined
    );

    if (targetComponent && targetComponent.id) {
      if (!this.dataComponent[targetComponent.id]) {
        this.dataComponent[targetComponent.id] = new ReplaySubject<Component>(
          1
        );
      }
      this.dataComponent[targetComponent.id].next(targetComponent);
    }

    components.forEach((component: Component) => {
      if (component.components && component.components.length > 0) {
        this.processComponent(component.components);
      }
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
          this.processComponent([res]);
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
    const componentsUrl = `${this.contentBackendUrl}/content/${key}`;

    this.http
      .get(componentsUrl)
      .pipe(
        map((res: any) => {
          this.dataContent[key].next(res);
          return res;
        }),
        catchError((e) => {
          this.dataContent[key].next({ error: e });
          return of('');
        })
      )
      .subscribe();
  }

  reloadOptions(key: string): void {
    const componentsUrl = `${this.contentBackendUrl}/options/${key}`;

    this.http
      .get(componentsUrl)
      .pipe(
        map((res) => {
          this.dataOptions[key].next(res);
          return res;
        }),
        catchError((e) => {
          this.dataOptions[key].next({ error: e });
          return of('');
        })
      )
      .subscribe();
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
