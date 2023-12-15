import {
  ExperienceDataService,
  experienceStaticRoutesFactory,
} from '@spryker-oryx/experience';
import { Mock } from 'vitest';

describe('experienceStaticRoutesFactory', () => {
  let experienceDataServiceMock: ExperienceDataService;
  let experienceDataMock: Mock;

  beforeEach(() => {
    experienceDataMock = vi.fn();
    experienceDataServiceMock = {
      getData: experienceDataMock,
    } as any;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return an empty routes array when no page data is available', () => {
    experienceDataMock.mockReturnValue([]);
    const result = experienceStaticRoutesFactory(experienceDataServiceMock);
    expect(result.routes).toEqual([]);
  });

  it('should correctly process single route', () => {
    experienceDataMock.mockReturnValue([
      {
        type: 'Page',
        meta: {
          route: '/test',
          routeType: 'testRoute',
        },
      },
    ]);
    const result = experienceStaticRoutesFactory(experienceDataServiceMock);
    expect(result.routes).toEqual([{ path: '/test', type: 'testRoute' }]);
  });

  it('should correctly process multiple routes in an array', () => {
    experienceDataMock.mockReturnValue([
      {
        type: 'Page',
        meta: {
          route: ['/test1', '/test2'],
          routeType: 'testRoute',
        },
      },
    ]);
    const result = experienceStaticRoutesFactory(experienceDataServiceMock);
    expect(result.routes).toEqual([
      { path: '/test1', type: 'testRoute' },
      { path: '/test2', type: 'testRoute' },
    ]);
  });

  it('should filter out non-Page types and pages without route metadata', () => {
    experienceDataMock.mockReturnValue([
      { type: 'Page', meta: { route: '/test' } }, // Missing routeType
      { type: 'Component', meta: { route: '/test', routeType: 'testRoute' } }, // Not a page
      { type: 'Page', meta: { route: '/test', routeType: 'testRoute' } }, // Valid
    ]);
    const result = experienceStaticRoutesFactory(experienceDataServiceMock);
    expect(result.routes).toEqual([{ path: '/test', type: 'testRoute' }]);
  });
});
