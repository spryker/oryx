import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { firstValueFrom, of } from 'rxjs';
import { DefaultTransformerService } from './default-transformer.service';
import { TransformerService } from './transformer.service';

const mockATransformer = vi.fn();
const mockBTransformer = vi.fn();

const mockData = 'mockData';

describe('DefaultTransformerService', () => {
  let service: DefaultTransformerService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: TransformerService,
          useClass: DefaultTransformerService,
        },
        {
          provide: 'mockATransformer',
          useValue: mockATransformer,
        },
        {
          provide: 'mockBTransformer',
          useValue: [mockBTransformer, mockATransformer],
        },
        {
          provide: 'mockLazyATransformer',
          useValue: () => Promise.resolve(mockATransformer),
        },
      ],
    });

    service = testInjector.inject(
      TransformerService
    ) as DefaultTransformerService;
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  it('should resolve transformer by type and call', () => {
    service.transform(
      mockData,
      'mockATransformer' as keyof InjectionTokensContractMap
    );
    expect(mockATransformer).toHaveBeenCalledWith(mockData, service);
  });

  it('should resolve transformers array by type and call the in chain', () => {
    service.transform(
      mockData,
      'mockBTransformer' as keyof InjectionTokensContractMap
    );
    expect(mockBTransformer).toHaveBeenCalledWith(mockData, service);
    expect(mockATransformer).toHaveBeenCalledWith(mockData, service);
  });

  it('should return result with transformed data if initial value is null', () => {
    const mockATransformerResult = 'mockATransformerResult';
    mockATransformer.mockReturnValue(mockATransformerResult);
    service
      .transform(
        mockData,
        'mockBTransformer' as keyof InjectionTokensContractMap
      )
      .subscribe((result) => {
        expect(result).toBe(mockATransformerResult);
      });
  });

  it('should return result with transformed data if prev transformed data is array', () => {
    const mockATransformerResult = 'mockATransformerResult';
    mockATransformer.mockReturnValue(mockATransformerResult);
    mockBTransformer.mockReturnValue(['data']);
    service
      .transform(
        mockData,
        'mockBTransformer' as keyof InjectionTokensContractMap
      )
      .subscribe((result) => {
        expect(result).toBe(mockATransformerResult);
      });
  });

  it('should return result with transformed data if prev transformed data is primitive', () => {
    const mockATransformerResult = 'mockATransformerResult';
    mockATransformer.mockReturnValue(mockATransformerResult);
    mockBTransformer.mockReturnValue(2);
    service
      .transform(
        mockData,
        'mockBTransformer' as keyof InjectionTokensContractMap
      )
      .subscribe((result) => {
        expect(result).toBe(mockATransformerResult);
      });
  });

  it('should resolve observables result from transformer', () => {
    const mockATransformerResult = 'mockATransformerResult';
    mockATransformer.mockReturnValue(of(mockATransformerResult));
    mockBTransformer.mockReturnValue(2);
    service
      .transform(
        mockData,
        'mockBTransformer' as keyof InjectionTokensContractMap
      )
      .subscribe((result) => {
        expect(result).toBe(mockATransformerResult);
      });
  });

  it('should return result with transformed concatenated data if prev transformed data is object', () => {
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
      .subscribe((result) => {
        expect(result).toEqual({
          ...mockATransformerResult,
          ...mockBTransformerResult,
        });
      });
  });

  it('should handle promises / lazy-loaded transformers', async () => {
    const mockATransformerResult = 'mockLazyATransformerResult';
    mockATransformer.mockReturnValue(mockATransformerResult);

    const result = await firstValueFrom(
      service.transform(
        mockData,
        'mockLazyATransformer' as keyof InjectionTokensContractMap
      )
    );
    expect(mockATransformer).toHaveBeenCalledWith(mockData, service);
    expect(result).toBe(mockATransformerResult);
  });

  it('should overwrite property with the value from the last transformer when multiple transformers modify the same property', () => {
    const mockFirstTransformerResult = { a: '5', b: '1' };
    const mockSecondTransformerResult = { a: '6', c: '2' };
    mockATransformer.mockReturnValueOnce(mockFirstTransformerResult);
    mockBTransformer.mockReturnValueOnce(mockSecondTransformerResult);

    service
      .transform(
        mockData,
        'mockBTransformer' as keyof InjectionTokensContractMap
      )
      .subscribe((result) => {
        expect(result).toEqual({ a: '5', b: '1', c: '2' });
      });
  });
});
