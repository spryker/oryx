import { fixture } from '@open-wc/testing-helpers';
import { createInjector } from '@spryker-oryx/di';
import { mockPickingListData } from '@spryker-oryx/picking/mocks';
import { PickingListService } from '@spryker-oryx/picking/services';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { PickingOrderReferenceComponent } from './order-reference.component';
import { pickingOrderReferenceComponent } from './order-reference.def';

class MockPickingListService implements Partial<PickingListService> {
  getList = vi.fn().mockReturnValue(of(mockPickingListData[0]));
  getUpcomingPickingListId = vi.fn().mockReturnValue(of(null));
}

describe('PickingOrderReferenceComponent', () => {
  let element: PickingOrderReferenceComponent;

  beforeAll(async () => {
    await useComponent(pickingOrderReferenceComponent);
  });

  beforeAll(async () => {
    createInjector({
      providers: [
        {
          provide: PickingListService,
          useClass: MockPickingListService,
        },
      ],
    });

    element = await fixture(
      html`<oryx-picking-order-reference
        .pickingListId="${mockPickingListData[0].id}"
      ></oryx-picking-order-reference>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should the reference', () => {
    expect(element.renderRoot?.textContent).toContain(
      mockPickingListData[0].orderReferences[0]
    );
  });
});
