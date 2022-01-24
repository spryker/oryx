import { of, take } from 'rxjs';
import { ExperienceService } from './experience.service';

let service: ExperienceService;
const mockStructureKey = 'bannerSlider';
const mockDataKey = 'homepage-banner';
let isAjax = 0;

const mockStructure = {
  id: mockStructureKey,
  type: 'LayoutSlot',
  components: [
    {
      id: 'homepage-banner',
      type: 'Banner',
    },
    {
      id: 'bannerSlider2',
      type: 'LayoutSlot',
      components: [
        {
          id: 'category-banner',
          type: 'Banner',
        },
        {
          id: 'bannerSlider3',
          type: 'LayoutSlot',
          components: [
            {
              id: 'homepage-banner',
              type: 'Banner',
            },
          ],
        },
      ],
    },
  ],
};

const mockContent = {
  items: [
    {
      title: 'Mock Dynamic component render',
    },
  ],
};

jest.mock('@spryker-oryx/injector', () => ({
  inject: (a: any) => a,
}));

jest.mock('rxjs/ajax', () => ({
  ajax: (params: any) => {
    isAjax++;
    if (params.url.includes('bannerSlider')) {
      return of({
        response: mockStructure,
      });
    }
    if (params.url.includes('homepage-banner')) {
      return of({
        response: mockContent,
      });
    }

    return of({ response: {} });
  },
}));

describe('ExperienceService', () => {
  beforeEach(() => {
    service = new ExperienceService();
    isAjax = 0;
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(ExperienceService);
  });

  describe('getStructure', () => {
    it('should return mock data', (done) => {
      service.getStructure({ key: mockStructureKey }).subscribe((data: any) => {
        expect(data).toBeTruthy();
        expect(data.id).toEqual(mockStructureKey);
        expect(data.type).toEqual('LayoutSlot');
        done();
      });
    });
    it('should not request second time', async () => {
      await service
        .getStructure({ key: mockStructureKey })
        .pipe(take(1))
        .toPromise();
      expect(isAjax).toEqual(1);
      await service
        .getStructure({ key: mockStructureKey })
        .pipe(take(1))
        .toPromise();
      expect(isAjax).toEqual(1);
    });

    it('should not request second time for cached substructures', async () => {
      await service
        .getStructure({ key: mockStructureKey })
        .pipe(take(1))
        .toPromise();
      const subStructure = (await service
        .getStructure({ key: 'bannerSlider2' })
        .pipe(take(1))
        .toPromise()) || { id: '', type: '' };
      expect(isAjax).toEqual(1);
      expect(subStructure.id).toEqual('bannerSlider2');
      expect(subStructure.type).toEqual('LayoutSlot');
    });
  });

  describe('getContent', () => {
    it('should return mock data', (done) => {
      service.getContent({ key: mockDataKey }).subscribe((data: any) => {
        expect(data).toBeTruthy();
        expect(data.items.length).toBeTruthy();
        done();
      });
    });
    it('should  not request second time', (done) => {
      service.getContent({ key: mockDataKey }).subscribe((data: any) => {
        expect(data).toBeTruthy();
        expect(data.items.length).toBeTruthy();
        done();
      });
    });
  });
});
