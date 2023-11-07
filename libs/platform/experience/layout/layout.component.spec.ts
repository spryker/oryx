import { fixture, html } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  LayoutBuilder,
  LayoutService,
  ScreenService,
} from '@spryker-oryx/experience';
import { useComponent } from '@spryker-oryx/utilities';
import { of } from 'rxjs';
import { LayoutComponent } from './layout.component';
import { layoutComponent } from './layout.def';

const mockLayoutService = {
  getStyles: vi.fn(),
  getRender: vi.fn().mockReturnValue(of('')),
  getStylesFromOptions: vi.fn(),
};

const mockLayoutBuilder = {
  createStylesFromOptions: vi.fn(),
  getActiveLayoutRules: vi.fn().mockReturnValue(of({})),
};

const mockScreenService = {
  getScreenSize: vi.fn(),
};

describe('LayoutComponent', () => {
  let element: LayoutComponent;

  beforeAll(async () => {
    await useComponent(layoutComponent);
  });

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: LayoutService,
          useValue: mockLayoutService,
        },
        {
          provide: LayoutBuilder,
          useValue: mockLayoutBuilder,
        },
        {
          provide: ScreenService,
          useValue: mockScreenService,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should render style tag with content from service', async () => {
    mockLayoutService.getStyles.mockReturnValue(of('stylesResult'));
    element = await fixture(html`<oryx-layout layout="grid"></oryx-layout>`);
    const style = element.renderRoot.querySelector('style');
    expect(mockLayoutService.getStyles).toHaveBeenCalledWith({
      grid: {},
    });
    expect(style?.textContent).toContain('stylesResult');
  });

  describe('when the version >= 1.2', () => {
    beforeEach(async () => {
      mockFeatureVersion('1.2');

      mockLayoutService.getStyles.mockReturnValue(of('stylesResult'));
      mockLayoutService.getStylesFromOptions.mockReturnValue(
        of('inlineResult')
      );
      element = await fixture(html`<oryx-layout layout="grid"></oryx-layout>`);
    });

    it('should render style tag with content from service', async () => {
      const style = element.renderRoot.querySelector('style');
      expect(style?.textContent).toContain('stylesResult');
      expect(style?.textContent).toContain('inlineResult');
    });
  });
});
