import { mockLitHtml } from '@/tools/testing';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { of, take } from 'rxjs';
import { Suggestion } from '../../../models';
import { SuggestionService } from '../suggestion.service';
import { DefaultSuggestionRendererService } from './default-suggestion-renderer.service';
import {
  SuggestionRenderer,
  SuggestionRendererOptions,
} from './suggestion-renderer.service';

vi.mock('lit', async () => ({
  ...((await vi.importActual('lit')) as Array<unknown>),
  html: mockLitHtml,
}));

const mockSuggestionRendererProducts = vi.fn();

const mockSuggestionRendererB = vi.fn();

const mockSuggestionService = {
  get: vi.fn(),
};

describe('DefaultSuggestionRendererService', () => {
  let renderer: DefaultSuggestionRendererService;

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: DefaultSuggestionRendererService,
          useClass: DefaultSuggestionRendererService,
        },
        {
          provide: SuggestionRenderer,
          useValue: {
            products: mockSuggestionRendererProducts,
            b: mockSuggestionRendererB,
          },
        },
        {
          provide: SuggestionService,
          useValue: mockSuggestionService,
        },
      ],
    });

    renderer = getInjector().inject(DefaultSuggestionRendererService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('get', () => {
    it('should return data from renderers', () => {
      const callback = vi.fn();
      mockSuggestionService.get.mockReturnValue(of({ a: 'a', b: 'b' }));
      const result = renderer.get('que', {
        a: 'a',
        b: 'b',
      } as SuggestionRendererOptions);
      result.pipe(take(1)).subscribe(callback);
      expect(mockSuggestionService.get).toHaveBeenCalledWith({
        entities: ['a', 'b'],
        query: 'que',
      });
      expect(callback).toHaveBeenCalledWith({ a: 'a', b: 'b' });
    });
  });

  describe('render', () => {
    it('should return data from renderers', () => {
      mockSuggestionRendererProducts.mockReturnValue(html`<div a></div>`);
      mockSuggestionRendererB.mockReturnValue(html`<div b></div>`);
      const result = renderer.render(
        { products: 'a', b: 'b' } as unknown as Suggestion,
        {
          products: {
            max: 3,
          },
          b: {},
          query: 'que',
        } as SuggestionRendererOptions & Record<'query', string>
      );
      expect(mockSuggestionRendererProducts).toHaveBeenCalledWith('a', {
        title: 'search.box.products',
        type: 'search',
        query: 'que',
        max: 3,
      });
      expect(mockSuggestionRendererB).toHaveBeenCalledWith('b', {
        title: 'search.box.b',
        type: 'search',
        query: 'que',
      });
      expect(result).toBe('<div a></div>,<div b></div>');
    });
  });
});
