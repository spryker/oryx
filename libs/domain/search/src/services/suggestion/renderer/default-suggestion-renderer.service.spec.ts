import { mockLitHtml } from '@/tools/testing';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { html } from 'lit';
import { of, take } from 'rxjs';
import { SuggestionRevealer } from '../revealer';
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

const mockSuggestionRevealerA = {
  reveal: vi.fn(),
};

const mockSuggestionRevealerB = {
  reveal: vi.fn(),
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
          provide: SuggestionRevealer,
          useValue: mockSuggestionRevealerA,
        },
        {
          provide: SuggestionRevealer,
          useValue: mockSuggestionRevealerB,
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
      mockSuggestionRevealerA.reveal.mockReturnValue(of({ a: 'a' }));
      mockSuggestionRevealerB.reveal.mockReturnValue(of({ b: 'b' }));
      const result = renderer.getSuggestions('que', {
        op1: 'op1',
        op2: 'op2',
      } as SuggestionRendererOptions);
      result.pipe(take(1)).subscribe(callback);
      expect(mockSuggestionRevealerA.reveal).toHaveBeenCalledWith({
        op1: 'op1',
        op2: 'op2',
        query: 'que',
      });
      expect(mockSuggestionRevealerB.reveal).toHaveBeenCalledWith({
        op1: 'op1',
        op2: 'op2',
        query: 'que',
      });
      expect(callback).toHaveBeenCalledWith({ a: 'a', b: 'b' });
    });
  });

  describe('render', () => {
    it('should return data from renderers', () => {
      const callback = vi.fn();
      mockSuggestionRevealerA.reveal.mockReturnValue(of({ a: 'a' }));
      mockSuggestionRevealerB.reveal.mockReturnValue(of({ b: 'b' }));
      mockSuggestionRendererA.mockReturnValue(html`<div a></div>`);
      mockSuggestionRendererB.mockReturnValue(html`<div b></div>`);
      renderer
        .getSuggestions('que', { entries: ['a', 'b'] })
        .pipe(take(1))
        .subscribe();
      const result = renderer.render();
      result.pipe(take(1)).subscribe(callback);
      expect(mockSuggestionRendererA).toHaveBeenCalledWith('a', {
        entries: ['a', 'b'],
        query: 'que',
      });
      expect(mockSuggestionRendererB).toHaveBeenCalledWith('b', {
        entries: ['a', 'b'],
        query: 'que',
      });
      expect(callback).toHaveBeenCalledWith('<div a></div>,<div b></div>');
    });
  });
});
