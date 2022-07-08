import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import { of, take } from 'rxjs';
import { DefaultTransformerService } from '../default-transformer.service';
import { TransformerService } from '../transformer.service';
import { DefaultJsonAPITransformerService } from './default-json-api-transformer.service';
import { JsonAPITransformerService } from './json-api-transformer.service';

const mockATransformer = vi.fn();
const mockBTransformer = vi.fn();

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

describe('DefaultJsonAPITransformerService', () => {
  let service: DefaultJsonAPITransformerService;
  let defaultService: DefaultTransformerService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: TransformerService,
          useClass: DefaultTransformerService,
        },
        {
          provide: JsonAPITransformerService,
          useClass: DefaultJsonAPITransformerService,
        },
        {
          provide: 'mockATransformer',
          useValue: mockATransformer,
        },
        {
          provide: 'mockBTransformer',
          useValue: [mockBTransformer, mockATransformer],
        },
      ],
    });

    service = testInjector.inject(
      JsonAPITransformerService
    ) as DefaultJsonAPITransformerService;
    defaultService = testInjector.inject(
      TransformerService
    ) as DefaultTransformerService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should call Deserializer.deserialize and call transformer callback with deserialized data', () => {
    const mockDeserializedData = 'mockDeserializedData';
    mockDeserialize.mockReturnValueOnce(mockDeserializedData);
    service
      .transform(
        mockInputData,
        'mockATransformer' as keyof InjectionTokensContractMap
      )
      .pipe(take(1))
      .subscribe();
    expect(mockDeserialize).toHaveBeenCalledWith(mockInputData);
    expect(mockATransformer).toHaveBeenCalledWith(
      mockDeserializedData,
      defaultService
    );
  });

  it('should resolve transformer by type and call', () => {
    service
      .transform(
        mockInputData,
        'mockATransformer' as keyof InjectionTokensContractMap
      )
      .pipe(take(1))
      .subscribe();
    expect(mockATransformer).toHaveBeenCalledWith(mockData, defaultService);
  });

  it('should resolve transformers array by type and call the in chain', () => {
    service
      .transform(
        mockInputData,
        'mockBTransformer' as keyof InjectionTokensContractMap
      )
      .pipe(take(1))
      .subscribe();
    expect(mockBTransformer).toHaveBeenCalledWith(mockData, defaultService);
    expect(mockATransformer).toHaveBeenCalledWith(mockData, defaultService);
  });

  it('should return result with transformed concatenated data', () => {
    const mockATransformerResult = {
      mockA: 'mockATransformerResult',
    };
    const mockBTransformerResult = {
      mockB: 'mockBTransformerResult',
    };
    mockATransformer.mockReturnValue(mockATransformerResult);
    mockBTransformer.mockReturnValue(mockBTransformerResult);
    service
      .transform(
        mockData,
        'mockBTransformer' as keyof InjectionTokensContractMap
      )
      .pipe(take(1))
      .subscribe((result) => {
        expect(result).toEqual({
          ...mockATransformerResult,
          ...mockBTransformerResult,
        });
      });
  });
});
