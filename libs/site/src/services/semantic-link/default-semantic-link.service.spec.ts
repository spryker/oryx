import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import {
  DefaultSemanticLinkService,
  SemanticLink,
  SemanticLinkService,
  SemanticLinkType,
} from '@spryker-oryx/site';
import { Observable } from 'rxjs';

describe('DefaultLinkService', () => {
  let service: SemanticLinkService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: SemanticLinkService,
          useClass: DefaultSemanticLinkService,
        },
      ],
    });

    service = testInjector.inject(SemanticLinkService);
  });

  afterEach(() => {
    vi.resetAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultSemanticLinkService);
  });

  describe('get method', () => {
    it('should return an observable', () => {
      const link: SemanticLink = { type: SemanticLinkType.Page, id: 'about' };
      expect(service.get(link)).toBeInstanceOf(Observable);
    });

    it('should return resolved link', () => {
      const link: SemanticLink = { type: SemanticLinkType.Page, id: 'about' };
      const callback = vi.fn();
      service.get(link).subscribe(callback);
      expect(callback).toHaveBeenCalledWith('/about');
    });

    it('should return resolved link when "product" type is provided', () => {
      const link: SemanticLink = { type: SemanticLinkType.Product, id: '1' };
      const callback = vi.fn();
      service.get(link).subscribe(callback);
      expect(callback).toHaveBeenCalledWith('/product/1');
    });

    it('should return resolved link when "category" type is provided', () => {
      const link: SemanticLink = {
        type: SemanticLinkType.Category,
        id: 'laptops',
      };
      const callback = vi.fn();
      service.get(link).subscribe(callback);
      expect(callback).toHaveBeenCalledWith('/category/laptops');
    });

    it('should return proper link when no slashes provided in path', () => {
      const link: SemanticLink = {
        type: SemanticLinkType.Product,
        id: 'cameras',
      };
      const callback = vi.fn();
      service.get(link).subscribe(callback);
      expect(callback).toHaveBeenCalledWith('/product/cameras');
    });
  });
});
