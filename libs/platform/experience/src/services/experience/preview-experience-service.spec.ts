import { nextFrame } from '@open-wc/testing-helpers';
import { HttpService } from '@spryker-oryx/core';
import { HttpTestService } from '@spryker-oryx/core/testing';
import { createInjector, destroyInjector, Injector } from '@spryker-oryx/di';
import { RouterEventType, RouterService } from '@spryker-oryx/router';
import { NEVER, of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ExperienceDataClientService, postMessage } from '../data-client';
import { ExperienceDataService } from '../experience-data';
import { ContentBackendUrl } from '../experience-tokens';
import { ExperienceService } from './experience.service';
import {
  POST_MESSAGE_TYPE,
  PreviewExperienceService,
  REQUEST_MESSAGE_TYPE,
} from './preview-experience.service';

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
  getEvents = vi.fn().mockReturnValue(NEVER);
}

class MockExperienceDataClientService implements ExperienceDataClientService {
  initialize = vi.fn().mockReturnValue(of(null));
  sendStatic = vi.fn();
}

const mockExperienceDataService = {
  getData: vi.fn().mockReturnValue([]),
};

describe('ExperiencePreviewService', () => {
  let service: PreviewExperienceService;
  let testInjector: Injector;

  beforeEach(() => {
    testInjector = createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: PreviewExperienceService,
        },
        {
          provide: ContentBackendUrl,
          useValue: ContentBackendUrl,
        },
        {
          provide: HttpService,
          useClass: HttpTestService,
        },
        {
          provide: ExperienceDataClientService,
          useClass: MockExperienceDataClientService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        {
          provide: ExperienceDataService,
          useValue: mockExperienceDataService,
        },
      ],
    });
    vi.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('when router is not set', () => {
    beforeEach(() => {
      service = testInjector.inject(
        ExperienceService
      ) as PreviewExperienceService;
    });

    it('should be provided', () => {
      expect(service).toBeInstanceOf(PreviewExperienceService);
    });

    it('should get route data', async () => {
      const callback = vi.fn();
      const routeValue = '/';
      postMessage(
        {
          type: POST_MESSAGE_TYPE,
          route: routeValue,
        },
        window
      );
      service.getRouteData().subscribe(callback);
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(routeValue);
    });

    it('should get interactive data', async () => {
      const callback = vi.fn();
      const interactionValue = {
        action: 'test',
        componentId: '1',
      };
      postMessage(
        {
          type: POST_MESSAGE_TYPE,
          interaction: interactionValue,
        },
        window
      );
      service.getInteractionData().subscribe(callback);
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(interactionValue);
    });

    it('should send post message to reload structure', async () => {
      const structure = 'test';
      service.getComponent({ uid: structure });
      await nextFrame();
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: REQUEST_MESSAGE_TYPE,
          structure: structure,
        },
        '*'
      );
    });

    it('should send post message to reload content', async () => {
      const content = 'test';
      service.getContent({ uid: content });
      await nextFrame();
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: REQUEST_MESSAGE_TYPE,
          content: content,
        },
        '*'
      );
    });

    it('should get structure data', async () => {
      const callback = vi.fn();
      const structure = {
        id: '/',
        type: 'Page',
        components: [
          {
            id: '1',
            type: 'Banner',
          },
          {
            id: '2',
            type: 'Slider',
          },
        ],
      };
      postMessage(
        {
          type: POST_MESSAGE_TYPE,
          structure,
        },
        window
      );
      service.getComponent({ uid: structure.id }).subscribe(callback);
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(structure);
    });

    it('should get content data', async () => {
      const callback = vi.fn();
      const content = {
        id: '1',
        data: {
          title: 'textarea title text1',
        },
      };
      postMessage(
        {
          type: POST_MESSAGE_TYPE,
          content,
        },
        window
      );
      service.getContent({ uid: content.id }).subscribe(callback);
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(content);
    });
  });

  describe('when router is set', () => {
    it('should send post message', async () => {
      (
        testInjector.inject(RouterService).getEvents as unknown as SpyInstance
      ).mockReturnValue(
        of({
          type: RouterEventType.NavigationEnd,
          route: '/new',
        })
      );
      testInjector.inject(ExperienceService);
      await nextFrame();
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: REQUEST_MESSAGE_TYPE,
          route: '/new',
        },
        '*'
      );
    });
  });
});
