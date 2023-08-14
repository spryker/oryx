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
import { Component } from '../../models';
import { ExperienceAdapter } from '../adapter';
import { ExperienceComponent, ExperienceDataService } from '../experience-data';
import { ContentBackendUrl } from '../experience-tokens';
import { ComponentQualifier, ExperienceService } from './experience.service';

type DataStore<T = unknown> = Record<string, ReplaySubject<T>>;

export class DefaultExperienceService implements ExperienceService {
  protected dataRoutes: DataStore<string> = {};
  protected dataComponent: DataStore<Component> = {};
  protected dataContent: DataStore = {};
  protected dataOptions: DataStore = {};
  protected experienceData: ExperienceComponent[] = [];

  constructor(
    protected contentBackendUrl = inject(ContentBackendUrl),
    protected http = inject(HttpService),
    protected experienceDataService = inject(ExperienceDataService),
    protected experienceAdapter = inject(ExperienceAdapter, null)
  ) {
    this.initExperienceData();
  }

  protected initExperienceData(): void {
    this.experienceData = this.experienceDataService.getData((c) => {
      this.processData(c);
    });
  }

  protected processComponent(
    _component: Component | ExperienceComponent
  ): void {
    const components = [_component];

    for (const component of components) {
      if (!component) {
        continue;
      }

      component.id ??= this.experienceDataService.getAutoId();
      this.processData(component);
      components.push(...(component.components ?? []));
    }
  }

  protected processData(component: Component | ExperienceComponent): void {
    if (component.meta?.route) {
      this.storeData('dataRoutes', component.meta.route, component.id);
    }

    this.storeData('dataComponent', component.id, component);
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
    /**
     * @deprecated Since version 1.2. Use provided `ExperienceAdapter.get` method.
     */
    const componentsUrl = `${
      this.contentBackendUrl
    }/components/?meta.route=${encodeURIComponent(route)}`;

    const adapter = this.experienceAdapter
      ? this.experienceAdapter.get({ id: route })
      : this.http.get<Component>(componentsUrl);

    adapter
      .pipe(tap((page: Component) => this.processComponent(page)))
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
}
