import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  Observable,
  of,
  ReplaySubject,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ContentBackendUrl } from '../experience-tokens';
import { ComponentQualifier, ExperienceService } from './experience.service';
import { Component } from './models';
import { ExperienceStaticData, StaticComponent } from './static-data';

type DataStore<T = unknown> = Record<string, ReplaySubject<T>>;

export class DefaultExperienceService implements ExperienceService {
  protected autoComponentId = 0;
  protected dataRoutes: DataStore<string> = {};
  protected dataComponent: DataStore<Component> = {};
  protected dataContent: DataStore = {};
  protected dataOptions: DataStore = {};

  constructor(
    protected contentBackendUrl = inject(ContentBackendUrl),
    protected http = inject(HttpService),
    protected staticData = inject(ExperienceStaticData, []).flat()
  ) {
    this.initStaticData();
  }

  protected initStaticData(): void {
    this.staticData = this.processStaticData();
  }

  protected processStaticData(shouldStore = true): Component[] {
    return this.staticData.map((component) => {
      this.processComponent(component, shouldStore);

      if (shouldStore) {
        this.storeData('dataRoutes', component.meta?.route, component.id);
      }
      return component as Component;
    });
  }

  protected processComponent(
    _component: Component | StaticComponent,
    shouldStore = true
  ): void {
    const components = [_component];

    for (const component of components) {
      component.id ??= this.getAutoId();

      if (shouldStore) {
        this.storeData('dataComponent', component.id, component);
      }

      components.push(...(component.components ?? []));
    }
  }

  protected storeData(
    dataStoreKey: string,
    byKey: keyof DataStore | undefined,
    data: unknown
  ): void {
    if (!byKey) {
      return;
    }

    const dataStore = this[dataStoreKey as keyof this] as unknown as DataStore;

    if (!dataStore[byKey]) {
      dataStore[byKey] = new ReplaySubject(1);
    }

    dataStore[byKey].next(data);
  }

  getComponent({ uid, route }: ComponentQualifier): Observable<Component> {
    if (uid) {
      if (!this.dataComponent[uid]) {
        this.dataComponent[uid] = new ReplaySubject(1);
        this.reloadComponent(uid);
      }
      return this.dataComponent[uid];
    }

    if (route) {
      return this.getComponentByRoute(route);
    }

    return throwError(() => {
      return new Error('Invalid qualifier for getComponent');
    });
  }

  protected reloadComponent(uid: string): void {
    const componentsUrl = `${
      this.contentBackendUrl
    }/components/${encodeURIComponent(uid)}`;

    this.http
      .get<Component>(componentsUrl)
      .pipe(
        tap((component) => {
          this.dataComponent[uid].next(component);
          this.processComponent(component);
        }),
        catchError(() => {
          this.dataComponent[uid].next({ id: uid, type: '' });
          return of({});
        })
      )
      .subscribe();
  }

  protected getComponentByRoute(route: string): Observable<Component> {
    if (!this.dataRoutes[route]) {
      this.dataRoutes[route] = new ReplaySubject(1);
      this.reloadComponentByRoute(route);
    }

    return this.dataRoutes[route].pipe(
      switchMap((uid: string) => {
        if (!this.dataComponent[uid]) {
          this.dataComponent[uid] = new ReplaySubject(1);
        }
        return this.dataComponent[uid];
      })
    );
  }

  protected reloadComponentByRoute(route: string): void {
    const componentsUrl = `${
      this.contentBackendUrl
    }/components/?meta.route=${encodeURIComponent(route)}`;
    this.http
      .get<Component[]>(componentsUrl)
      .pipe(
        tap((components) => {
          // TODO: why only first one
          if (!components?.length) {
            return;
          }
          const component = components[0];
          this.processComponent(component);
          this.storeData('dataRoutes', route, component.id);
        })
      )
      .subscribe();
  }

  getContent({ uid }: { uid: string }): Observable<any> {
    if (!this.dataContent[uid]) {
      this.dataContent[uid] = new ReplaySubject(1);
      this.reloadContent(uid);
    }

    return this.dataContent[uid];
  }

  protected reloadContent(uid: string): void {
    this.getComponent({ uid: uid })
      .pipe(
        take(1),
        tap((component) => {
          const content = component?.content ?? {};
          this.dataContent[uid].next(content);
        })
      )
      .subscribe();
  }

  getOptions({ uid }: { uid: string }): Observable<any> {
    if (!this.dataOptions[uid]) {
      this.dataOptions[uid] = new ReplaySubject(1);
      this.reloadOptions(uid);
    }

    return this.dataOptions[uid];
  }

  protected reloadOptions(uid: string): void {
    this.getComponent({ uid })
      .pipe(take(1))
      .subscribe((component) => {
        const options = component?.options ?? {};
        this.dataOptions[uid].next(options);
      });
  }

  protected getAutoId(): string {
    return `static${this.autoComponentId++}`;
  }
}
