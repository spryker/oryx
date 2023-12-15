import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceAdapter } from '@spryker-oryx/experience';
import { lastValueFrom, of } from 'rxjs';
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
      type: 'component',
      entities: ['component'],
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
      type: 'component',
      entities: ['component'],
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

  describe('when featureVersion is 1.4', () => {
    beforeEach(() => mockFeatureVersion('1.4'));

    it('should getAll method returns the correct result', async () => {
      const components = [
        { id: 'test-id-1', meta: { route: 'test-route-1' } },
        { id: 'test-id-2', meta: { route: 'test-route-2' } },
      ];
      const data = components.map((component) => ({
        data: JSON.stringify(component),
        id: component.id,
      }));

      mockContentService.getAll.mockReturnValue(of(data));

      const result = await lastValueFrom(adapter.getAll());

      expect(result).toEqual(components);
      expect(mockContentService.getAll).toHaveBeenCalledWith({
        type: 'component',
        entities: ['component'],
      });
    });

    it('should get method returns the correct result', async () => {
      const components = [
        { id: 'test-id-1', meta: { route: 'test-route-1' } },
        { id: 'test-id-2', meta: { route: 'test-route-2' } },
      ];
      const data = components.map((component) => ({
        data: JSON.stringify(component),
        id: component.id,
      }));
      mockContentService.getAll.mockReturnValue(of(data));
      const result = await lastValueFrom(adapter.getAll());
      expect(result).toEqual(components);
      expect(contentService.getAll).toHaveBeenCalledWith({
        type: 'component',
        entities: ['component'],
      });
    });

    it('get returns the correct component and getAll returns all components', async () => {
      const components = [
        { id: 'test-id-1', meta: { route: 'test-route-1' } },
        { id: 'test-id-2', meta: { route: 'test-route-2' } },
      ];
      const data = components.map((component) => ({
        data: JSON.stringify(component),
        id: component.id,
      }));
      const qualifier = { id: 'test-id-1' };
      mockContentService.getAll.mockReturnValue(of(data));
      const result = await lastValueFrom(adapter.get(qualifier));
      expect(result).toEqual(components[0]);
    });
  });
});
