import { mockLitHtml } from '@/tools/testing';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { of, take } from 'rxjs';
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

const mockSuggestionRendererA = vi.fn();

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
            a: mockSuggestionRendererA,
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

  describe('getSuggestions', () => {
    it('should return data from renderers', () => {
      const callback = vi.fn();
      mockSuggestionService.get.mockReturnValue(of({ a: 'a', b: 'b' }));
      const result = renderer.getSuggestions('que', {
        op1: 'op1',
        op2: 'op2',
        entities: ['a', 'b'],
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
      const callback = vi.fn();
      mockSuggestionService.get.mockReturnValue(of({ a: 'a', b: 'b' }));
      mockSuggestionRendererA.mockReturnValue(html`<div a></div>`);
      mockSuggestionRendererB.mockReturnValue(html`<div b></div>`);
      renderer
        .getSuggestions('que', {
          entities: ['a', 'b'],
          aCount: 3,
        } as SuggestionRendererOptions)
        .pipe(take(1))
        .subscribe();
      const result = renderer.render();
      result.pipe(take(1)).subscribe(callback);
      expect(mockSuggestionRendererA).toHaveBeenCalledWith('a', {
        count: 3,
        title: 'search.box.a',
        type: 'search',
        query: 'que',
      });
      expect(mockSuggestionRendererB).toHaveBeenCalledWith('b', {
        title: 'search.box.b',
        type: 'search',
        query: 'que',
      });
      expect(callback).toHaveBeenCalledWith('<div a></div>,<div b></div>');
    });
  });
});
