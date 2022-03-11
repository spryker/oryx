import { createInjector } from '@spryker-oryx/injector';
import { Observable, of } from 'rxjs';
import {
  Component,
  ComponentsRegistryContract,
  ExperienceService,
  Services,
} from '../services';
import './';
import { ExperienceComposition } from './experience-composition';

const BASE_COMPONENTS = [
  { id: '1', type: 'oryx-banner' },
  { id: '2', type: 'oryx-banner' },
  { id: '3', type: 'oryx-banner' },
];

class MockExperience implements Partial<ExperienceService> {
  components = [...BASE_COMPONENTS];
  getStructure = (): Observable<Component> =>
    of({
      id: '',
      type: '',
      components: this.components,
    });
}

class MockComponentsRegistryService
  implements Partial<ComponentsRegistryContract>
{
  resolveComponent(type: string): Observable<string> {
    return of(type);
  }
}

describe('Experience Composition', () => {
  beforeEach(async () => {
    createInjector({
      override: true,
      providers: [
        {
          provide: Services.Experience,
          useClass: MockExperience,
        },
        {
          provide: Services.ComponentsRegistry,
          useClass: MockComponentsRegistryService,
        },
      ],
    });

    document.body.innerHTML =
      '<experience-composition></experience-composition>';
    await window.happyDOM.whenAsyncComplete();
  });

  const getElement = (): ExperienceComposition | null => {
    return document.body.querySelector('experience-composition');
  };

  it('is defined', () => {
    expect(getElement()).toBeInstanceOf(ExperienceComposition);
  });

  it('should render oryx-banner', () => {
    const banner = getElement()?.shadowRoot?.querySelector('oryx-banner');
    expect(banner).toBeTruthy();
  });

  it('should render components with uid and componentid attributes', () => {
    const banner = getElement()?.shadowRoot?.querySelector('oryx-banner');

    expect(banner?.getAttribute('uid')).toBe('1');
  });
});
