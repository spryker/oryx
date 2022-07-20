import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { of, take } from 'rxjs';
import { TransformerService } from '../transformer.service';
import { DefaultJsonAPITransformerService } from './default-json-api-transformer.service';
import { JsonAPITransformerService } from './json-api-transformer.service';

const mockData = 'mockData';
const mockInputData = 'mockInputData';
const mockDeserialize = vi.fn().mockReturnValue(mockData);

vi.mock('jsonapi-serializer', () => ({
  Deserializer: vi
    .fn()
    .mockImplementation(() => ({ deserialize: mockDeserialize })),
}));

vi.mock('../../../utilities', () => ({
  ssrAwaiter: vi.fn().mockImplementation((data) => of(data)),
}));

const mockDefaultTransformer = {
  transform: vi.fn().mockImplementation((data) => of(data)),
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

  it('should call Deserializer.deserialize', () => {
    service
      .transform(
        mockInputData,
        'mockATransformer' as keyof InjectionTokensContractMap
      )
      .pipe(take(1))
      .subscribe();
    expect(mockDeserialize).toHaveBeenCalledWith(mockInputData);
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
        expect(result).toBe(mockResult);
        expect(mockDefaultTransformer.transform).toHaveBeenCalledWith(
          mockDeserializedData,
          'mockBTransformer'
        );
      });
  });
});
