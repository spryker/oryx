import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceAdapter } from '@spryker-oryx/experience';
import { lastValueFrom, of } from 'rxjs';
import { ContentFields } from '../../models';
import { ContentService } from '../content.service';
import { ContentExperienceAdapter } from './content-experience.adapter';

const mockContentService = {
  getAll: vi.fn(),
};

describe('ContentExperienceAdapter', () => {
  let adapter: ExperienceAdapter;
  let contentService: ContentService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        { provide: ContentService, useValue: mockContentService },
        { provide: ExperienceAdapter, useClass: ContentExperienceAdapter },
      ],
    });

    contentService = testInjector.inject(ContentService);
    adapter = testInjector.inject(ExperienceAdapter);
  });

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  it('should getAll method returns the correct result', async () => {
    const components = [
      { id: 'test-id-1', meta: { route: 'test-route-1' } },
      { id: 'test-id-2', meta: { route: 'test-route-2' } },
    ];
    const data = components.map((component) => ({
      fields: { data: JSON.stringify(component), id: component.id },
    }));

    mockContentService.getAll.mockReturnValue(of(data));

    const result = await lastValueFrom(adapter.getAll());

    expect(result).toEqual(components);
    expect(mockContentService.getAll).toHaveBeenCalledWith({
      type: ContentFields.Component,
      entities: [ContentFields.Component],
    });
  });

  it('should get method returns the correct result', async () => {
    const components = [
      { id: 'test-id-1', meta: { route: 'test-route-1' } },
      { id: 'test-id-2', meta: { route: 'test-route-2' } },
    ];
    const data = components.map((component) => ({
      fields: { data: JSON.stringify(component), id: component.id },
    }));
    mockContentService.getAll.mockReturnValue(of(data));
    const result = await lastValueFrom(adapter.getAll());
    expect(result).toEqual(components);
    expect(contentService.getAll).toHaveBeenCalledWith({
      type: ContentFields.Component,
      entities: [ContentFields.Component],
    });
  });

  it('get returns the correct component and getAll returns all components', async () => {
    const components = [
      { id: 'test-id-1', meta: { route: 'test-route-1' } },
      { id: 'test-id-2', meta: { route: 'test-route-2' } },
    ];
    const data = components.map((component) => ({
      fields: { data: JSON.stringify(component), id: component.id },
    }));
    const qualifier = { id: 'test-id-1' };
    mockContentService.getAll.mockReturnValue(of(data));
    const result = await lastValueFrom(adapter.get(qualifier));
    expect(result).toEqual(components[0]);
  });
});
