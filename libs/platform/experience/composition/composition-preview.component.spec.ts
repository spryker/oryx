/* eslint-disable @typescript-eslint/no-explicit-any */
import { fixture } from '@open-wc/testing-helpers';
import { SSRAwaiterService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  ComponentsRegistryService,
  ComponentTemplate,
  ExperienceService,
  LayoutBuilder,
  LayoutService,
} from '@spryker-oryx/experience';
import { html, TemplateResult } from 'lit';
import { Observable, of } from 'rxjs';
import { previewCompositionComponent } from './composition.def';
import { CompositionPreviewComponent } from './composition-preview.component';
import { SpyInstance } from 'vitest';
import * as compositionController from './composition-components.controller';

const BASE_COMPONENTS = [
  { id: '1', type: 'oryx-content-banner' },
  { id: '2', type: 'oryx-content-banner' },
  { id: '3', type: 'oryx-content-banner' },
];

class MockExperienceService implements Partial<ExperienceService> {
  getOptions = (): Observable<any> => of({});
  getContent = (): Observable<any> => of({});
  getInteractionData = (): Observable<any> => of({});
}

class MockLayoutBuilder implements Partial<LayoutBuilder> {
  getLayoutClasses = vi.fn();
  getLayoutStyles = vi.fn();
  collectStyles = vi.fn();
  createStylesFromOptions = vi.fn();
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
  hasDynamicallyVisibleChild: vi.fn().mockReturnValue(of(false)),
};
vi.spyOn(
  compositionController,
  'CompositionComponentsController'
) as SpyInstance;
(
  compositionController.CompositionComponentsController as unknown as SpyInstance
).mockReturnValue(mockComponents);

describe('CompositionPreviewComponent', () => {
  let element: CompositionPreviewComponent;

  beforeAll(async () => {
    await useComponent(previewCompositionComponent);
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
    expect(element).toBeInstanceOf(CompositionPreviewComponent);
  });

  it('should render components with uid attributes', () => {
    expect(element).toContainElement('oryx-content-banner[uid="1"]');
  });
});
