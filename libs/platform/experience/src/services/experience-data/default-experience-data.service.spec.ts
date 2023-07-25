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
      type: 'a-component',
      components: [
        {
          type: 'a-component',
          components: [
            {
              id: 'a-component',
            },
            {
              id: 'a-component',
              components: [
                {
                  type: 'b-component',
                  options: { b: 'b' },
                },
                {
                  type: 'c-component',
                  options: { c: 'c' },
                },
                {
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
      type: 'a-component',
      components: [
        {
          type: 'a-component',
        },
      ],
    },
  ],
};

const mockMergeComponent = {
  options: { merge: 'merge' },
  components: [
    {
      type: 'merge-component',
    },
  ],
};

describe('DefaultExperienceDataService', () => {
  let service: ExperienceDataService;

  afterEach(() => {
    destroyInjector();
    vi.resetAllMocks();
  });

  describe('when use ExperienceDataMergeType.Before strategy', () => {
    describe('when selector index is defined', () => {
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
                  selector: '#a.a-component>2.a-component[2].b-component[2]',
                },
              },
              mockPageA,
              mockPageB,
            ]),
          ],
        });

        service = testInjector.inject(ExperienceDataService);
      });
      it('should add element before needed selector', () => {
        const result = service.getData().find((c) => c.id === 'a')
          ?.components?.[0].components?.[0].components?.[1];
        const expected = {
          id: 'a-component',
          components: [
            { type: 'b-component', options: { b: 'b' } },
            { type: 'c-component', options: { c: 'c' } },
            { type: 'merge-component' },
            { type: 'b-component', options: { b: 'b' } },
          ],
        };
        expect(expected).toEqual(result);
      });
    });

    describe('when selector index is not defined', () => {
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
                  selector: '#a.a-component>2.a-component[2].b-component',
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
        const result = service.getData().find((c) => c.id === 'a')
          ?.components?.[0].components?.[0].components?.[1];
        const expected = {
          id: 'a-component',
          components: [
            { type: 'merge-component' },
            { type: 'b-component', options: { b: 'b' } },
            { type: 'c-component', options: { c: 'c' } },
            { type: 'merge-component' },
            { type: 'b-component', options: { b: 'b' } },
          ],
        };
        expect(expected).toEqual(result);
      });
    });
  });

  describe('when use ExperienceDataMergeType.After strategy', () => {
    describe('when selector index is defined', () => {
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
                  selector: '#a.a-component>2.a-component[2].b-component[2]',
                },
              },
              mockPageA,
              mockPageB,
            ]),
          ],
        });

        service = testInjector.inject(ExperienceDataService);
      });
      it('should add element after needed selector', () => {
        const result = service.getData().find((c) => c.id === 'a')
          ?.components?.[0].components?.[0].components?.[1];
        const expected = {
          id: 'a-component',
          components: [
            { type: 'b-component', options: { b: 'b' } },
            { type: 'c-component', options: { c: 'c' } },
            { type: 'b-component', options: { b: 'b' } },
            { type: 'merge-component' },
          ],
        };
        expect(expected).toEqual(result);
      });
    });

    describe('when selector index is not defined', () => {
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
                  selector: '#a.a-component>2.a-component[2].b-component',
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
        const result = service.getData().find((c) => c.id === 'a')
          ?.components?.[0].components?.[0].components?.[1];
        const expected = {
          id: 'a-component',
          components: [
            { type: 'b-component', options: { b: 'b' } },
            { type: 'merge-component' },
            { type: 'c-component', options: { c: 'c' } },
            { type: 'b-component', options: { b: 'b' } },
            { type: 'merge-component' },
          ],
        };
        expect(expected).toEqual(result);
      });
    });
  });

  describe('when use ExperienceDataMergeType.Replace strategy', () => {
    describe('when selector index is defined', () => {
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
                  selector: '#a.a-component>2.a-component[2].b-component[2]',
                },
              },
              mockPageA,
              mockPageB,
            ]),
          ],
        });

        service = testInjector.inject(ExperienceDataService);
      });
      it('should replace element by needed selector', () => {
        const result = service.getData().find((c) => c.id === 'a')
          ?.components?.[0].components?.[0].components?.[1];
        const expected = {
          id: 'a-component',
          components: [
            { type: 'b-component', options: { b: 'b' } },
            { type: 'c-component', options: { c: 'c' } },
            { type: 'oryx-composition', ...mockMergeComponent },
          ],
        };

        expect(expected).toEqual(result);
      });
    });

    describe('when selector index is not defined', () => {
      beforeEach(() => {
        const testInjector = createInjector({
          providers: [
            {
              provide: ExperienceDataService,
              useClass: DefaultExperienceDataService,
            },
            provideExperienceData([
              {
                type: 'custom-type',
                ...mockMergeComponent,
                merge: {
                  type: 'replace',
                  selector: '#a.a-component>2.a-component[2].b-component',
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
        const result = service.getData().find((c) => c.id === 'a')
          ?.components?.[0].components?.[0].components?.[1];
        const expected = {
          id: 'a-component',
          components: [
            { type: 'custom-type', ...mockMergeComponent },
            { type: 'c-component', options: { c: 'c' } },
            { type: 'custom-type', ...mockMergeComponent },
          ],
        };
        expect(expected).toEqual(result);
      });
    });
  });

  describe('when use ExperienceDataMergeType.Patch strategy', () => {
    describe('when selector index is defined', () => {
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
                  selector: '#a.a-component>2.a-component[2].b-component[2]',
                },
              },
              mockPageA,
              mockPageB,
            ]),
          ],
        });

        service = testInjector.inject(ExperienceDataService);
      });
      it('should merge element by needed selector', () => {
        const result = service.getData().find((c) => c.id === 'a')
          ?.components?.[0].components?.[0].components?.[1];
        const expected = {
          id: 'a-component',
          components: [
            { type: 'b-component', options: { b: 'b' } },
            { type: 'c-component', options: { c: 'c' } },
            {
              type: 'b-component',
              ...mockMergeComponent,
              options: { b: 'b', ...mockMergeComponent.options },
            },
          ],
        };

        expect(expected).toEqual(result);
      });
    });

    describe('when selector index is not defined', () => {
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
                  selector: '#a.a-component>2.a-component[2].b-component',
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
        const result = service.getData().find((c) => c.id === 'a')
          ?.components?.[0].components?.[0].components?.[1];
        const expected = {
          id: 'a-component',
          components: [
            {
              type: 'b-component',
              ...mockMergeComponent,
              options: { b: 'b', ...mockMergeComponent.options },
            },
            { type: 'c-component', options: { c: 'c' } },
            {
              type: 'b-component',
              ...mockMergeComponent,
              options: { b: 'b', ...mockMergeComponent.options },
            },
          ],
        };

        expect(expected).toEqual(result);
      });
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
                selector: '#a.a-component>2.a-component[2].b-component[2]',
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
      const result = service.getData().find((c) => c.id === 'a')
        ?.components?.[0].components?.[0].components?.[1];
      const expected = {
        id: 'a-component',
        components: [
          { type: 'b-component', options: { b: 'b' } },
          { type: 'c-component', options: { c: 'c' } },
          { type: 'b-component', options: { b: 'b' } },
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
                selector: '#a.a-component>2.a-component[2].b-component[2]',
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
      const result = service.getData().find((c) => c.id === 'a')
        ?.components?.[0].components?.[0].components?.[1];
      const expected = {
        id: 'a-component',
        components: [
          mockMergeComponent,
          { type: 'b-component', options: { b: 'b' } },
          { type: 'c-component', options: { c: 'c' } },
          { type: 'b-component', options: { b: 'b' } },
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
      const b = result[0];
      const a = result[1];

      expect(b.id).toBe('b');
      expect(b.components).toEqual([
        mockMergeComponent,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...mockPageB.components!,
      ]);
      expect(a.id).toBe('a');
      expect(a.components).toEqual([
        mockMergeComponent,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...mockPageA.components!,
      ]);
    });
  });
});
