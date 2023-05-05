import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { html } from 'lit';
import MockDate from 'mockdate';
import { of } from 'rxjs';
import { PickingListsHeaderComponent } from './picking-lists-header.component';
import { pickingListsHeaderComponent } from './picking-lists-header.def';

const mockedDate = new Date(1970, 1, 1);
const formattedDate = 'formattedDate';

class MockLocaleService implements Partial<LocaleService> {
  formatDate = vi.fn().mockReturnValue(of(formattedDate));
}

describe('PickingListsHeaderComponent', () => {
  let element: PickingListsHeaderComponent;
  let locateService: MockLocaleService;

  beforeAll(async () => {
    await useComponent(pickingListsHeaderComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: LocaleService,
          useClass: MockLocaleService,
        },
      ],
    });

    locateService = testInjector.inject(
      LocaleService
    ) as unknown as MockLocaleService;

    MockDate.set(mockedDate);

    element = await fixture(
      html`<oryx-picking-lists-header></oryx-picking-lists-header>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
    MockDate.reset();
  });

  it('should format current date', () => {
    expect(locateService.formatDate).toBeCalledWith(+mockedDate);
  });

  it('should render current date', () => {
    const header = element.renderRoot.querySelector('h4');
    expect(header?.textContent).toContain(formattedDate);
  });
});
