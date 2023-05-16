import { AppRef, PageMetaService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FontInjectable } from '@spryker-oryx/utilities';
import { DefaultFontInjectable } from './default-font.injectable';

export const mockResource = {
  getFont: vi.fn(),
};

export const mockApp = {
  findPlugin: vi.fn().mockReturnValue(mockResource),
};

export const mockPageMetaService = {
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
          async: '',
        },
      });
    });
  });

  describe('when font by id us not exist', () => {
    it('should not call PageMetaService.add if font by id exist', () => {
      mockResource.getFont.mockReturnValue(undefined);
      injectable.setFont('a');
      expect(mockResource.getFont).toHaveBeenCalledWith('a');
      expect(mockPageMetaService.add).not.toHaveBeenCalled();
    });
  });
});
