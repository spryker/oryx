/* eslint-disable @typescript-eslint/no-explicit-any */
import { fixture } from '@open-wc/testing-helpers';
import { ContentConfig } from '@spryker-oryx/content';
import { EntityService, SSRAwaiterService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  ComponentTemplate,
  ComponentsRegistryService,
  ExperienceService,
  LayoutBuilder,
  LayoutService,
} from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { useComponent } from '@spryker-oryx/utilities';
import { TemplateResult, html } from 'lit';
import { Observable, of } from 'rxjs';
import { SpyInstance } from 'vitest';
import * as compositionController from './composition-components.controller';
import { CompositionComponent } from './composition.component';
import { compositionComponent } from './composition.def';

const BASE_COMPONENTS = [
  { id: '1', type: 'oryx-content-banner' },
  { id: '2', type: 'oryx-content-banner' },
  { id: '3', type: 'oryx-content-banner' },
];

class MockExperienceService implements Partial<ExperienceService> {
  getOptions = <T>(): Observable<T> => of({} as T);
  getContent = <T>(): Observable<T> => of({} as T);
}

class MockLayoutBuilder implements Partial<LayoutBuilder> {
  getLayoutClasses = vi.fn();
  getLayoutStyles = vi.fn();
  collectStyles = vi.fn();
  createStylesFromOptions = vi.fn();
  getLayoutMarkers = vi.fn();
}

class MockSSRAwaiter {
  getAwaiter = vi.fn();
}

class MockComponentsRegistryService
  implements Partial<ComponentsRegistryService>
{
  resolveComponent(type: string): Observable<string> {
    return of(type);
  }

  resolveTemplate(data: ComponentTemplate): TemplateResult {
    return html`<oryx-content-banner uid="${data.uid}"></oryx-content-banner>`;
  }
}

class MockLayoutService implements Partial<LayoutService> {
  getStyles = vi.fn().mockReturnValue(of(null));
}

const mockComponents = {
  getComponents: vi.fn().mockReturnValue(of([...BASE_COMPONENTS])),
  hasDynamicallyVisibleComponent: vi.fn().mockReturnValue(of(false)),
};
vi.spyOn(
  compositionController,
  'CompositionComponentsController'
) as SpyInstance;
(
  compositionController.CompositionComponentsController as unknown as SpyInstance
).mockReturnValue(mockComponents);

const mockRouter = {
  redirectNotFound: vi.fn(),
};

const mockEntityService = {
  getContextKey: vi.fn(),
};

describe('CompositionComponent', () => {
  let element: CompositionComponent;

  beforeAll(async () => {
    await useComponent(compositionComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: LayoutService,
          useClass: MockLayoutService,
        },
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
        {
          provide: RouterService,
          useValue: mockRouter,
        },
        {
          provide: ContentConfig,
          useValue: [],
        },
        {
          provide: EntityService,
          useValue: mockEntityService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-composition uid="1"></oryx-composition>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(CompositionComponent);
  });

  it('should render components with uid attributes', () => {
    expect(element).toContainElement('oryx-content-banner[uid="1"]');
  });
});
