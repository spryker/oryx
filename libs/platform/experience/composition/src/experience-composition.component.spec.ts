import { fixture } from '@open-wc/testing-helpers';
import { SSRAwaiterService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  Component,
  ComponentsRegistryService,
  ExperienceService,
  LayoutBuilder,
} from '@spryker-oryx/experience';
import { html, TemplateResult } from 'lit';
import { Observable, of } from 'rxjs';
import { experienceCompositionComponent } from './composition.def';
import { ExperienceCompositionComponent } from './experience-composition.component';

const BASE_COMPONENTS = [
  { id: '1', type: 'oryx-content-banner' },
  { id: '2', type: 'oryx-content-banner' },
  { id: '3', type: 'oryx-content-banner' },
];

class MockExperienceService implements Partial<ExperienceService> {
  components = [...BASE_COMPONENTS];
  getComponent = (): Observable<Component> =>
    of({
      id: '',
      type: '',
      components: this.components,
    });
  getOptions = <T>(): Observable<T> => of({} as T);
  getContent = <T>(): Observable<T> => of({} as T);
}

class MockLayoutBuilder implements Partial<LayoutBuilder> {
  getLayoutClasses = (): string => '';
  getLayoutStyles = (): string => '';
  collectStyles = (): string => '';
}

class MockSSRAwaiter {
  getAwaiter(): unknown {
    return () => {
      //do nothing
    };
  }
}

class MockComponentsRegistryService
  implements Partial<ComponentsRegistryService>
{
  resolveComponent(type: string): Observable<string> {
    return of(type);
  }

  resolveTemplate(type: string, uid: string): TemplateResult {
    return html`<oryx-content-banner uid="${uid}"></oryx-content-banner>`;
  }
}

describe('Experience Composition', () => {
  let element: ExperienceCompositionComponent;

  beforeAll(async () => {
    await useComponent(experienceCompositionComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: MockExperienceService,
        },
        {
          provide: ComponentsRegistryService,
          useClass: MockComponentsRegistryService,
        },
        {
          provide: LayoutBuilder,
          useClass: MockLayoutBuilder,
        },
        {
          provide: SSRAwaiterService,
          useClass: MockSSRAwaiter,
        },
      ],
    });

    element = await fixture(
      html`<experience-composition uid="1"></experience-composition>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(ExperienceCompositionComponent);
  });

  it('should render oryx-content-banner', () => {
    const banner = element?.shadowRoot?.querySelector('oryx-content-banner');
    expect(banner).toBeTruthy();
  });

  it('should render components with uid attributes', () => {
    const banner = element?.shadowRoot?.querySelector('oryx-content-banner');

    expect(banner?.getAttribute('uid')).toBe('1');
  });
});
