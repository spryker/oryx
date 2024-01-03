import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  DefaultExperienceDataService,
  ExperienceComponent,
  ExperienceDataService,
  provideExperienceData,
} from '../experience-data';

const mockPageA: ExperienceComponent = {
  id: 'a',
  components: [
    {
      id: 'a1',
      type: 'a-component',
      components: [
        {
          id: 'a2',
          type: 'a-component',
          components: [
            {
              id: 'a-component',
            },
            {
              id: 'a-component',
              components: [
                {
                  id: 'a3',
                  type: 'b-component',
                  options: { b: 'b' },
                },
                {
                  id: 'a3',
                  type: 'c-component',
                  options: { c: 'c' },
                },
                {
                  id: 'a3',
                  type: 'b-component',
                  options: { b: 'b' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const mockPageB: ExperienceComponent = {
  id: 'b',
  components: [
    {
      id: 'b1',
      type: 'a-component',
      components: [
        {
          id: 'b2',
          type: 'a-component',
          components: [],
        },
      ],
    },
  ],
};

const mockMergeComponent = {
  id: expect.anything(),
  type: 'merge-component',
  options: { merge: 'merge' },
};

describe('DefaultExperienceDataService', () => {
  let service: ExperienceDataService;

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  describe('when use ExperienceDataMergeType.Before strategy', () => {
    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: ExperienceDataService,
            useClass: DefaultExperienceDataService,
          },
          provideExperienceData([
            {
              ...mockMergeComponent,
              merge: {
                type: 'before',
                selector: '#a.a-component>3.b-component',
              },
            },
            mockPageA,
            mockPageB,
          ]),
        ],
      });

      service = testInjector.inject(ExperienceDataService);
    });

    it('should add element before all selectors', () => {
      const result = (
        service.getData().find((c) => c.id?.includes('a'))
          ?.components as ExperienceComponent
      )?.[0].components?.[0].components?.[1];
      const expected = {
        id: expect.anything(),
        components: [
          mockMergeComponent,
          { type: 'b-component', id: expect.anything(), options: { b: 'b' } },
          { type: 'c-component', id: expect.anything(), options: { c: 'c' } },
          mockMergeComponent,
          { type: 'b-component', id: expect.anything(), options: { b: 'b' } },
        ],
      };
      expect(expected).toEqual(result);
    });
  });

  describe('when use ExperienceDataMergeType.After strategy', () => {
    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: ExperienceDataService,
            useClass: DefaultExperienceDataService,
          },
          provideExperienceData([
            {
              ...mockMergeComponent,
              merge: {
                type: 'after',
                selector: '#a.a-component>3.b-component',
              },
            },
            mockPageA,
            mockPageB,
          ]),
        ],
      });

      service = testInjector.inject(ExperienceDataService);
    });

    it('should add element after all selectors', () => {
      const result = (
        service.getData().find((c) => c.id?.includes('a'))
          ?.components as ExperienceComponent
      )?.[0].components?.[0].components?.[1];
      const expected = {
        id: expect.anything(),
        components: [
          { type: 'b-component', id: expect.anything(), options: { b: 'b' } },
          mockMergeComponent,
          { type: 'c-component', id: expect.anything(), options: { c: 'c' } },
          { type: 'b-component', id: expect.anything(), options: { b: 'b' } },
          mockMergeComponent,
        ],
      };
      expect(expected).toEqual(result);
    });
  });

  describe('when use ExperienceDataMergeType.Replace strategy', () => {
    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: ExperienceDataService,
            useClass: DefaultExperienceDataService,
          },
          provideExperienceData([
            {
              ...mockMergeComponent,
              merge: {
                type: 'replace',
                selector: '#a.a-component>3.b-component',
              },
            },
            mockPageA,
            mockPageB,
          ]),
        ],
      });

      service = testInjector.inject(ExperienceDataService);
    });

    it('should replace all elements by selectors', () => {
      const result = (
        service.getData().find((c) => c.id?.includes('a'))
          ?.components as ExperienceComponent
      )?.[0].components?.[0].components?.[1];
      const expected = {
        id: expect.anything(),
        components: [
          mockMergeComponent,
          { type: 'c-component', id: expect.anything(), options: { c: 'c' } },
          mockMergeComponent,
        ],
      };

      expect(expected).toEqual(result);
    });
  });

  describe('when use ExperienceDataMergeType.Remove strategy', () => {
    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: ExperienceDataService,
            useClass: DefaultExperienceDataService,
          },
          provideExperienceData([
            {
              merge: {
                type: 'remove',
                selector: '#a.a-component>3.b-component',
              },
            },
            mockPageA,
            mockPageB,
          ]),
        ],
      });

      service = testInjector.inject(ExperienceDataService);
    });

    it('should remove all elements by selectors', () => {
      const result = (
        service.getData().find((c) => c.id?.includes('a'))
          ?.components as ExperienceComponent
      )?.[0].components?.[0].components?.[1];
      const expected = {
        id: expect.anything(),
        components: [
          { type: 'c-component', id: expect.anything(), options: { c: 'c' } },
        ],
      };

      expect(expected).toEqual(result);
    });
  });

  describe('when use ExperienceDataMergeType.Patch strategy', () => {
    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: ExperienceDataService,
            useClass: DefaultExperienceDataService,
          },
          provideExperienceData([
            {
              ...mockMergeComponent,
              merge: {
                type: 'patch',
                selector: '#a.a-component>3.b-component',
              },
            },
            mockPageA,
            mockPageB,
          ]),
        ],
      });

      service = testInjector.inject(ExperienceDataService);
    });

    it('should merge all elements by selectors', () => {
      const result = (
        service.getData().find((c) => c.id?.includes('a'))
          ?.components as ExperienceComponent
      )?.[0].components?.[0].components?.[1];
      const expected = {
        id: expect.anything(),
        components: [
          {
            ...mockMergeComponent,
            options: { b: 'b', ...mockMergeComponent.options },
          },
          { type: 'c-component', id: expect.anything(), options: { c: 'c' } },
          {
            ...mockMergeComponent,
            options: { b: 'b', ...mockMergeComponent.options },
          },
        ],
      };

      expect(expected).toEqual(result);
    });
  });

  describe('when use ExperienceDataMergeType.Append strategy', () => {
    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: ExperienceDataService,
            useClass: DefaultExperienceDataService,
          },
          provideExperienceData([
            {
              ...mockMergeComponent,
              merge: {
                type: 'append',
                selector: '#a.a-component>3',
              },
            },
            mockPageA,
            mockPageB,
          ]),
        ],
      });

      service = testInjector.inject(ExperienceDataService);
    });

    it('should merge add element to the components', () => {
      const result = (
        service.getData().find((c) => c.id?.includes('a'))
          ?.components as ExperienceComponent
      )?.[0].components?.[0].components?.[1];
      const expected = {
        id: expect.anything(),
        components: [
          { type: 'b-component', id: expect.anything(), options: { b: 'b' } },
          { type: 'c-component', id: expect.anything(), options: { c: 'c' } },
          { type: 'b-component', id: expect.anything(), options: { b: 'b' } },
          mockMergeComponent,
        ],
      };

      expect(expected).toEqual(result);
    });
  });

  describe('when use ExperienceDataMergeType.Prepend strategy', () => {
    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: ExperienceDataService,
            useClass: DefaultExperienceDataService,
          },
          provideExperienceData([
            {
              ...mockMergeComponent,
              merge: {
                type: 'prepend',
                selector: '#a.a-component>3',
              },
            },
            mockPageA,
            mockPageB,
          ]),
        ],
      });

      service = testInjector.inject(ExperienceDataService);
    });

    it('should merge prepend element to the components', () => {
      const result = (
        service.getData().find((c) => c.id?.includes('a'))
          ?.components as ExperienceComponent
      )?.[0].components?.[0].components?.[1];
      const expected = {
        id: expect.anything(),
        components: [
          mockMergeComponent,
          { type: 'b-component', id: expect.anything(), options: { b: 'b' } },
          { type: 'c-component', id: expect.anything(), options: { c: 'c' } },
          { type: 'b-component', id: expect.anything(), options: { b: 'b' } },
        ],
      };

      expect(expected).toEqual(result);
    });
  });

  describe('when template id is not defined', () => {
    beforeEach(() => {
      const testInjector = createInjector({
        providers: [
          {
            provide: ExperienceDataService,
            useClass: DefaultExperienceDataService,
          },
          provideExperienceData([
            {
              ...mockMergeComponent,
              merge: {
                type: 'prepend',
                selector: 'a-component',
              },
            },
            mockPageA,
            mockPageB,
          ]),
        ],
      });

      service = testInjector.inject(ExperienceDataService);
    });
    it('should use merge strategy for all templates', () => {
      const result = service.getData();
      const a = result[0];
      const b = result[1];

      expect(b.id).toContain('b');
      expect(
        (b.components as ExperienceComponent)?.[0].components?.[0]
      ).toEqual(mockMergeComponent);
      expect(a.id).toContain('a');
      expect(
        (a.components as ExperienceComponent)?.[0].components?.[0]
      ).toEqual(mockMergeComponent);
    });
  });
});
