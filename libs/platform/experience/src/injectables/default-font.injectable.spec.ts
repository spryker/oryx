import { AppRef, PageMetaService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FontInjectable } from '@spryker-oryx/utilities';
import { finalize } from 'rxjs';
import { DefaultFontInjectable } from './default-font.injectable';

vi.mock('lit', async () => ({
  ...((await vi.importActual('lit')) as Array<unknown>),
  isServer: false,
}));

const mockResource = {
  getFont: vi.fn(),
};

const mockApp = {
  requirePlugin: vi.fn().mockReturnValue(mockResource),
};

const mockPageMetaService = {
  add: vi.fn(),
};

describe('DefaultFontInjectable', () => {
  let injectable: FontInjectable;

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: AppRef,
          useValue: mockApp,
        },
        {
          provide: PageMetaService,
          useValue: mockPageMetaService,
        },
      ],
    });
    injectable = new DefaultFontInjectable();
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when font by id exist', () => {
    it('should call PageMetaService.add ', () => {
      const mockFont = 'mockFont';
      mockResource.getFont.mockReturnValue(mockFont);
      injectable.setFont('a');
      expect(mockResource.getFont).toHaveBeenCalledWith('a');
      expect(mockPageMetaService.add).toHaveBeenCalledWith({
        name: 'link',
        attrs: {
          rel: 'stylesheet',
          href: mockFont,
          media: 'all',
        },
      });
    });

    it('should return observable and emit if font loaded', async () => {
      const callback = vi.fn();
      const complete = vi.fn();
      const mockFont = '1em Roboto';
      const mockFonts = {
        fonts: {
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          check: vi.fn().mockReturnValue(true),
        },
      };
      vi.stubGlobal('document', mockFonts);
      mockResource.getFont.mockReturnValue('mockFont');
      injectable
        .setFont('a', mockFont)
        .pipe(finalize(complete))
        .subscribe(callback);
      expect(mockFonts.fonts.check).toHaveBeenCalledWith(mockFont);
      expect(complete).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(true);
    });

    it('should not complete stream if font is not loaded', async () => {
      const callback = vi.fn();
      const complete = vi.fn();
      vi.stubGlobal('document', {
        fonts: {
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          check: vi.fn().mockReturnValue(false),
        },
      });
      mockResource.getFont.mockReturnValue('mockFont');
      injectable
        .setFont('a', '1em Roboto')
        .pipe(finalize(complete))
        .subscribe(callback);
      expect(complete).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(false);
    });
  });

  describe('when font by id us not exist', () => {
    it('should not call PageMetaService.add if font by id exist', () => {
      const callback = vi.fn();
      mockResource.getFont.mockReturnValue(undefined);
      injectable.setFont('a').subscribe(callback);
      expect(mockResource.getFont).toHaveBeenCalledWith('a');
      expect(mockPageMetaService.add).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(false);
    });
  });
});
