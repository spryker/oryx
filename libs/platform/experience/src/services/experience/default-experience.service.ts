import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, of, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ContentBackendUrl } from '../experience-tokens';
import { ComponentQualifier, ExperienceService } from './experience.service';
import { Component } from './models';
import { ExperienceStaticData } from './static-data';

export class DefaultExperienceService implements ExperienceService {
  protected dataRoutes: Record<string, ReplaySubject<string>> = {};
  protected dataComponent: Record<string, ReplaySubject<Component>> = {};
  protected dataContent: Record<string, ReplaySubject<any>> = {};
  protected dataOptions: Record<string, ReplaySubject<any>> = {};
  protected autoComponentId = 0;

  constructor(
    protected contentBackendUrl = inject(ContentBackendUrl),
    protected http = inject(HttpService),
    protected staticData = inject(ExperienceStaticData, [])
  ) {
    this.initStaticData();
  }

  protected initStaticData(): void {
    console.log('initStaticData');
    this.staticData.flat().forEach((component) => {
      component.id = component.id ?? this.getAutoId();

      if (!this.dataComponent[component.id]) {
        this.dataComponent[component.id] = new ReplaySubject<Component>(1);
      }
      this.dataComponent[component.id].next(component as Component);
      if (component.meta?.route) {
        if (!this.dataRoutes[component.meta.route]) {
          this.dataRoutes[component.meta.route] = new ReplaySubject<string>(1);
        }
        this.dataRoutes[component.meta.route].next(component.id);
      }
      this.processComponent(component as Component);
    });
  }

  protected processComponent(component: Component): void {
    const components = component?.components || [];

    component.id = component.id ?? this.getAutoId();

    if (!this.dataComponent[component.id]) {
      this.dataComponent[component.id] = new ReplaySubject<Component>(1);
    }
    this.dataComponent[component.id].next(component);

    components.forEach((component: Component) => {
      this.processComponent(component);
    });
  }

  protected getAutoId(): string {
    return `static${this.autoComponentId++}`;
  }

  protected reloadComponent(uid: string): void {
    const componentsUrl = `${
      this.contentBackendUrl
    }/components/${encodeURIComponent(uid)}`;

    this.http
      .get<Component>(componentsUrl)
      .pipe(
        map((component) => {
          this.dataComponent[uid].next(component);
          this.processComponent(component);
          return component;
        }),
        catchError(() => {
          this.dataComponent[uid].next({ id: uid, type: '', components: [] });
          return of({});
        })
      )
      .subscribe();
  }

  protected reloadComponentByRoute(route: string): void {
    const componentsUrl = `${
      this.contentBackendUrl
    }/components/?meta.route=${encodeURIComponent(route)}`;
    this.http
      .get<Component[]>(componentsUrl)
      .pipe(
        tap((components) => {
          if (!components || !components.length) {
            return;
          }
          const component = components[0];
          const componentId = component.id;
          this.dataRoutes[route].next(componentId);
          if (!this.dataComponent[componentId]) {
            this.dataComponent[componentId] = new ReplaySubject<Component>(1);
          }
          this.dataComponent[componentId].next(component);
          this.processComponent(component);
        })
      )
      .subscribe();
  }

  protected reloadContent(uid: string): void {
    this.getComponent({ uid: uid })
      .pipe(take(1))
      .subscribe((component) => {
        const content = component?.content ?? {};
        this.dataContent[uid].next(content);
      });
  }

  protected reloadOptions(uid: string): void {
    this.getComponent({ uid: uid })
      .pipe(take(1))
      .subscribe((component) => {
        const options = component?.options ?? {};
        this.dataOptions[uid].next(options);
      });
  }

  getComponent({ uid, route }: ComponentQualifier): Observable<Component> {
    if (uid) {
      if (!this.dataComponent[uid]) {
        this.dataComponent[uid] = new ReplaySubject<Component>(1);
        this.reloadComponent(uid);
      }
      return this.dataComponent[uid];
    }

    if (route) {
      return this.getComponentByRoute(route);
    }

    throw new Error('Invalid qualifier for getComponent');
  }

  protected getComponentByRoute(route: string): Observable<Component> {
    if (!this.dataRoutes[route]) {
      this.dataRoutes[route] = new ReplaySubject<string>(1);
      this.reloadComponentByRoute(route);
    }
    return this.dataRoutes[route].pipe(
      switchMap((uid: string) => {
        if (!this.dataComponent[uid]) {
          this.dataComponent[uid] = new ReplaySubject<Component>(1);
        }
        return this.dataComponent[uid];
      })
    );
  }

  getContent({ uid }: { uid: string }): Observable<any> {
    if (!this.dataContent[uid]) {
      this.dataContent[uid] = new ReplaySubject<any>(1);
      this.reloadContent(uid);
    }

    return this.dataContent[uid];
  }

  getOptions({ uid }: { uid: string }): Observable<any> {
    if (!this.dataOptions[uid]) {
      this.dataOptions[uid] = new ReplaySubject<any>(1);
      this.reloadOptions(uid);
    }

    return this.dataOptions[uid];
  }
}
