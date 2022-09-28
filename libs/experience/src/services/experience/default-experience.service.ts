import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Observable, of, ReplaySubject, switchMap, take } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONTENT_BACKEND_URL } from '../experience-tokens';
import { ComponentQualifier, ExperienceService } from './experience.service';
import { Component } from './models';

export class DefaultExperienceService implements ExperienceService {
  protected dataRoutes: Record<string, ReplaySubject<string>> = {};
  protected dataComponent: Record<string, ReplaySubject<Component>> = {};
  protected dataContent: Record<string, ReplaySubject<any>> = {};
  protected dataOptions: Record<string, ReplaySubject<any>> = {};

  constructor(
    protected contentBackendUrl = inject(CONTENT_BACKEND_URL),
    protected http = inject(HttpService)
  ) {}

  protected processComponent(component: Component): void {
    const components = component?.components || [];

    if (component?.id) {
      if (!this.dataComponent[component.id]) {
        this.dataComponent[component.id] = new ReplaySubject<Component>(1);
      }
      this.dataComponent[component.id].next(component);
    }

    components.forEach((component: Component) => {
      this.processComponent(component);
    });
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
        map((component) => {
          const componentId = component[0].id!;
          this.dataRoutes[route].next(componentId);
          if (!this.dataComponent[componentId]) {
            this.dataComponent[componentId] = new ReplaySubject<Component>(1);
          }
          this.dataComponent[componentId].next(component[0]);
          this.processComponent(component[0]);
          return component[0];
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
