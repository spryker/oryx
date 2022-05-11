import { HttpService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CONTENT_BACKEND_URL } from '../experience-tokens';
import { ExperienceService } from './experience.service';
import { Component } from './models';

export class DefaultExperienceService implements ExperienceService {
  protected dataStructure: { [key: string]: ReplaySubject<Component> } = {};
  protected dataContent: { [key: string]: ReplaySubject<any> } = {};

  constructor(
    protected contentBackendUrl = inject(CONTENT_BACKEND_URL),
    protected http = inject(HttpService)
  ) {}

  protected processStructure(components: Component[]): void {
    const targetComponent: any = components.find((component: any) =>
      component.components ? component.id : undefined
    );

    if (targetComponent && targetComponent.id) {
      if (!this.dataStructure[targetComponent.id]) {
        this.dataStructure[targetComponent.id] = new ReplaySubject<Component>(
          1
        );
      }
      this.dataStructure[targetComponent.id].next(targetComponent);
    }

    components.forEach((component: any) => {
      if (component.components && component.components.length > 0) {
        this.processStructure(component.components);
      }
    });
  }

  reloadStructure(key: string): void {
    const componentsUrl = `${
      this.contentBackendUrl
    }/structure/${encodeURIComponent(key)}`;

    this.http
      .get(componentsUrl)
      .pipe(
        map((res: any) => {
          this.dataStructure[key].next(res);
          this.processStructure([res]);
          return res;
        }),
        catchError(() => {
          this.dataStructure[key].next({ type: '', components: [] });
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

  getStructure({ key }: { key: string }): Observable<Component> {
    if (!this.dataStructure[key]) {
      this.dataStructure[key] = new ReplaySubject<Component>(1);
      this.reloadStructure(key);
    }
    return this.dataStructure[key];
  }

  getContent({ key }: { key: string }): Observable<any> {
    if (!this.dataContent[key]) {
      this.dataContent[key] = new ReplaySubject<any>(1);
      this.reloadContent(key);
    }

    return this.dataContent[key];
  }
}
