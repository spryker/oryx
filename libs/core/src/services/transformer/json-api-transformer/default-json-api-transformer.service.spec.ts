import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import * as jsonapi from 'jsonapi-serializer';
import { of, take } from 'rxjs';
import { TransformerService } from '../transformer.service';
import { DefaultJsonAPITransformerService } from './default-json-api-transformer.service';
import { JsonAPITransformerService } from './json-api-transformer.service';

const mockData = 'mockData';
const mockInputData = { mockInputData: 'mockInputData' };
const mockDeserialize = vi.fn().mockReturnValue(mockData);

vi.mock('jsonapi-serializer', () => ({
  default: {
    Deserializer: vi
      .fn()
      .mockImplementation(() => ({ deserialize: mockDeserialize })),
  },
}));

vi.mock('@spryker-oryx/core/utilities', () => ({
  ssrAwaiter: vi.fn().mockImplementation((data: unknown) => of(data)),
}));

const mockDefaultTransformer = {
  transform: vi.fn().mockImplementation((data: unknown) => of(data)),
};

describe('DefaultJsonAPITransformerService', () => {
  let service: DefaultJsonAPITransformerService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: TransformerService,
          useValue: mockDefaultTransformer,
        },
        {
          provide: JsonAPITransformerService,
          useClass: DefaultJsonAPITransformerService,
        },
      ],
    });

    service = testInjector.inject(
      JsonAPITransformerService
    ) as DefaultJsonAPITransformerService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('transform', () => {
    it('should call Deserializer.deserialize', () => {
      service
        .transform(
          mockInputData,
          'mockATransformer' as keyof InjectionTokensContractMap
        )
        .pipe(take(1))
        .subscribe();
      expect((jsonapi as any).default.Deserializer).toHaveBeenCalledWith({
        keyForAttribute: 'camelCase',
      });
      expect(mockDeserialize).toHaveBeenCalledWith(mockInputData);
      service.transform(
        mockInputData,
        'mockATransformer' as keyof InjectionTokensContractMap
      );
      expect((jsonapi as any).default.Deserializer).toHaveBeenCalledTimes(1);
    });

    it('should call injected TransformerService.transform with deserialized data and return transformed data', () => {
      const mockDeserializedData = 'mockDeserializedData';
      const mockResult = 'mockResult';
      mockDeserialize.mockReturnValueOnce(mockDeserializedData);
      mockDefaultTransformer.transform.mockReturnValueOnce(of(mockResult));
      service
        .transform(
          mockInputData,
          'mockBTransformer' as keyof InjectionTokensContractMap
        )
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual(mockResult);
          expect(mockDefaultTransformer.transform).toHaveBeenCalledWith(
            mockDeserializedData,
            'mockBTransformer'
          );
        });
    });
  });
  describe('serialize', () => {
    it('should call injected TransformerService.transform with passed attributes and return transformed attributes wrapped in `data` object', () => {
      const serializedResult = {
        type: 'type',
        a: 'a',
        b: 'b',
        c: 'c',
      };
      mockDefaultTransformer.transform.mockReturnValue(of(serializedResult));
      service
        .serialize(
          mockInputData,
          'mockBTransformer' as keyof InjectionTokensContractMap
        )
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toEqual({
            data: serializedResult,
          });
          expect(mockDefaultTransformer.transform).toHaveBeenCalledWith(
            mockInputData,
            'mockBTransformer'
          );
        });
    });
  });
});
