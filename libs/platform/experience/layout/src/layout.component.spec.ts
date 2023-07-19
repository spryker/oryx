import { fixture, html } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LayoutBuilder, LayoutService } from '@spryker-oryx/experience';
import { useComponent } from '@spryker-oryx/utilities';
import { of } from 'rxjs';
import { LayoutComponent } from './layout.component';
import { layoutComponent } from './layout.def';

const mockLayoutService = {
  getStyles: vi.fn(),
};

const mockLayoutBuilder = {
  createStylesFromOptions: vi.fn(),
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
    expect(mockLayoutService.getStyles).toHaveBeenCalledWith({ grid: {} });
    expect(style?.textContent).toContain('stylesResult');
  });
});
