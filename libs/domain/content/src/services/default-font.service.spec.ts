import { PageMetaService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { DefaultFontService } from './default-font.service';
import { FontService } from './fonts.service';

class MockPageMetaService implements Partial<PageMetaService> {
  add = vi.fn();
}

describe('DefaultFontService', () => {
  let service: FontService;
  let pageMetaService: MockPageMetaService;

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: PageMetaService,
          useClass: MockPageMetaService,
        },
        {
          provide: FontService,
          useClass: DefaultFontService,
        },
      ],
    });

    service = injector.inject(FontService);
    pageMetaService = injector.inject<MockPageMetaService>(PageMetaService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultFontService);
  });

  describe('when the text contains one font', () => {
    beforeEach(() => {
      service.install(`<p style="font-family:'my-font'">content</p>`);
    });

    it('should install the font', () => {
      expect(pageMetaService.add).toHaveBeenCalledOnce();
    });
  });

  describe('when the text contains two fonts', () => {
    beforeEach(() => {
      service.install(
        `<p style="font-family:'my-first-font'">content</p><p style="font-family:'my-second-font'">content</p>`
      );
    });

    it('should install both fonts', () => {
      expect(pageMetaService.add).toHaveBeenCalledTimes(2);
    });
  });

  describe('when the text contains the same font twice', () => {
    beforeEach(() => {
      service.install(
        `<p style="font-family:'my-first-font'">content</p><p style="font-family:'my-first-font'">content</p>`
      );
    });

    it('should install the fonts once', () => {
      expect(pageMetaService.add).toHaveBeenCalledOnce();
    });
  });
});
