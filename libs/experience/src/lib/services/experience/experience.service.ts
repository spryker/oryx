import { ExperienceContract } from './experience.contract';
import { Component } from './models';
import { inject } from '@spryker-oryx/injector';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';

export class ExperienceService implements ExperienceContract {
  protected contentBackendUrl = inject('CONTENT_BACKEND_URL');
  protected dataStructure: { [key: string]: ReplaySubject<Component> } = {};
  protected dataContent: { [key: string]: ReplaySubject<any> } = {};

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

    const params: any = {
      method: 'GET',
      url: componentsUrl,
      responseType: 'json',
    };

    if ((ExperienceService as any).createXHR) {
      params.createXHR = (ExperienceService as any).createXHR;
    }

    ajax(params)
      .pipe(
        map((res: any) => {
          this.dataStructure[key].next(res.response);
          this.processStructure([res.response]);
          return res.response;
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

    const params: any = {
      method: 'GET',
      url: componentsUrl,
      responseType: 'json',
    };

    if ((ExperienceService as any).createXHR) {
      params.createXHR = (ExperienceService as any).createXHR;
    }

    ajax(params)
      .pipe(
        map((res: any) => {
          this.dataContent[key].next(res.response);
          return res.response;
        }),
        catchError(() => {
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
