import { fixture } from '@open-wc/testing-helpers';
import { SSRAwaiterService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { html, TemplateResult } from 'lit';
import { Observable, of } from 'rxjs';
import {
  Component,
  ComponentsRegistryService,
  ExperienceService,
} from '../src/services';
import { ExperienceCompositionComponent } from './experience-composition.component';
import { experienceCompositionComponent } from './index';

useComponent(experienceCompositionComponent);

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
