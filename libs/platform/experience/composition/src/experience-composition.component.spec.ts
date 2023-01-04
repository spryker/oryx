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
  { id: '1', type: 'oryx-banner' },
  { id: '2', type: 'oryx-banner' },
  { id: '3', type: 'oryx-banner' },
];

class MockExperienceService implements Partial<ExperienceService> {
  components = [...BASE_COMPONENTS];
  getComponent = (): Observable<Component> =>
    of({
      id: '',
      type: '',
      components: this.components,
    });
}

class MockLayoutBuilder implements Partial<LayoutBuilder> {
  getLayoutClasses = (): string => '';
  getLayoutStyles = (): string => '';
  collectStyles = (): string => '';
}

class MockSSRAwaiter {
  getAwaiter(key: string): any {
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
    return html`<oryx-banner uid="${uid}"></oryx-banner>`;
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

  it('should render oryx-banner', () => {
    const banner = element?.shadowRoot?.querySelector('oryx-banner');
    expect(banner).toBeTruthy();
  });

  it('should render components with uid attributes', () => {
    const banner = element?.shadowRoot?.querySelector('oryx-banner');

    expect(banner?.getAttribute('uid')).toBe('1');
  });
});
