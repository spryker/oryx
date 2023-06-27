import { mockLitHtml } from '@/tools/testing';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { of, take } from 'rxjs';
import { DefaultSuggestionRendererService } from './default-suggestion-renderer.service';
import {
  SuggestionRenderer,
  SuggestionRendererOptions,
} from './suggestion-renderer.service';

vi.mock('lit', async () => ({
  ...((await vi.importActual('lit')) as Array<unknown>),
  html: mockLitHtml,
}));

const mockSuggestionRendererA = {
  getSuggestions: vi.fn(),
  render: vi.fn(),
};

const mockSuggestionRendererB = {
  getSuggestions: vi.fn(),
  render: vi.fn(),
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
          useValue: mockSuggestionRendererA,
        },
        {
          provide: SuggestionRenderer,
          useValue: mockSuggestionRendererB,
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
      mockSuggestionRendererA.getSuggestions.mockReturnValue(of({ a: 'a' }));
      mockSuggestionRendererB.getSuggestions.mockReturnValue(of({ b: 'b' }));
      const result = renderer.getSuggestions('que', {
        op1: 'op1',
        op2: 'op2',
      } as SuggestionRendererOptions);
      result.pipe(take(1)).subscribe(callback);
      expect(mockSuggestionRendererA.getSuggestions).toHaveBeenCalledWith({
        query: 'que',
        op1: 'op1',
        op2: 'op2',
      });
      expect(mockSuggestionRendererB.getSuggestions).toHaveBeenCalledWith({
        query: 'que',
        op1: 'op1',
        op2: 'op2',
      });
      expect(callback).toHaveBeenCalledWith({ a: 'a', b: 'b' });
    });
  });

  describe('render', () => {
    it('should return data from renderers', () => {
      const callback = vi.fn();
      mockSuggestionRendererA.getSuggestions.mockReturnValue(of({ a: 'a' }));
      mockSuggestionRendererA.render.mockReturnValue(html`<div a></div>`);
      mockSuggestionRendererB.getSuggestions.mockReturnValue(of({ b: 'b' }));
      mockSuggestionRendererB.render.mockReturnValue(html`<div b></div>`);
      renderer.getSuggestions('que').pipe(take(1)).subscribe();
      const result = renderer.render();
      result.pipe(take(1)).subscribe(callback);
      expect(mockSuggestionRendererA.render).toHaveBeenCalledWith(
        { a: 'a', b: 'b' },
        'que'
      );
      expect(mockSuggestionRendererB.render).toHaveBeenCalledWith(
        { a: 'a', b: 'b' },
        'que'
      );
      expect(callback).toHaveBeenCalledWith('<div a></div>,<div b></div>');
    });
  });
});
