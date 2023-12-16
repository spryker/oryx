import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { MerchantService } from '../src';
import { MerchantScheduleComponent } from './schedule.component';
import { merchantOpeningHoursComponent } from './schedule.def';

class MockMerchantService implements Partial<MerchantService> {
  get = vi.fn();
}

const singleTimeSlotMock = {
  day: 'monday',
  times: [{ from: '08:00:00.000000', to: '18:00:00.000000' }],
};

const multipleTimeSlotsMock = {
  day: 'tuesday',
  times: [
    { from: '08:00:00.000000', to: '13:00:00.000000' },
    { from: '14:00:00.000000', to: '19:00:00.000000' },
  ],
};

const noTimeSlotMocks = {
  day: 'wednesday',
  times: [],
};

describe('MerchantScheduleComponent', () => {
  let element: MerchantScheduleComponent;
  let merchantService: MockMerchantService;

  beforeAll(async () => {
    await useComponent(merchantOpeningHoursComponent);
  });

  beforeEach(async () => {
    const injector = createInjector({
      providers: [
        {
          provide: MerchantService,
          useClass: MockMerchantService,
        },
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
      ],
    });

    merchantService = injector.inject<MockMerchantService>(MerchantService);
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when a merchant has at least 1 opening day', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(
        of({ id: '123', schedule: { opened: [singleTimeSlotMock] } })
      );

      element = await fixture(
        html`<oryx-merchant-opening-hours
          merchant="123"
        ></oryx-merchant-opening-hours>`
      );
    });

    it('should render a heading', () => {
      expect(element).toContainElement('h3');
    });

    it('should render the schedule', () => {
      expect(element).toContainElement('ul');
    });
  });

  describe('when a merchant has no opening days provided', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(of({ id: '123' }));

      element = await fixture(
        html`<oryx-merchant-opening-hours
          merchant="123"
        ></oryx-merchant-opening-hours>`
      );
    });

    it('should not render a heading', () => {
      expect(element).not.toContainElement('h3');
    });

    it('should not render the schedule', () => {
      expect(element).not.toContainElement('ul');
    });
  });

  describe('when a merchant has 1 opening day', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(
        of({ id: '123', schedule: { opened: [singleTimeSlotMock] } })
      );

      element = await fixture(
        html`<oryx-merchant-opening-hours
          merchant="123"
        ></oryx-merchant-opening-hours>`
      );
    });

    it('should render 1 day', () => {
      expect(element).toContainElement('li:nth-child(1)');
      expect(element).not.toContainElement('li:nth-child(2)');
    });
  });

  describe('when a merchant has 2 opening days', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(
        of({
          id: '123',
          schedule: { opened: [singleTimeSlotMock, multipleTimeSlotsMock] },
        })
      );

      element = await fixture(
        html`<oryx-merchant-opening-hours
          merchant="123"
        ></oryx-merchant-opening-hours>`
      );
    });

    it('should render 1 day', () => {
      expect(element).toContainElement('li:nth-child(2)');
      expect(element).not.toContainElement('li:nth-child(3)');
    });
  });

  describe('when a merchant has 2 opening on a day', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(
        of({ id: '123', schedule: { opened: [multipleTimeSlotsMock] } })
      );

      element = await fixture(
        html`<oryx-merchant-opening-hours
          merchant="123"
        ></oryx-merchant-opening-hours>`
      );
    });

    it('should render 4 time elements for the first day', () => {
      const times = element.shadowRoot?.querySelectorAll('li oryx-site-time');
      expect(times?.length).toBe(4);
    });
  });

  describe('when a merchant has no opening hours for a day', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(
        of({ id: '123', schedule: { opened: [noTimeSlotMocks] } })
      );

      element = await fixture(
        html`<oryx-merchant-opening-hours
          merchant="123"
        ></oryx-merchant-opening-hours>`
      );
    });

    it('should render closed', () => {
      const day = element.shadowRoot?.querySelector('div');
      expect(day?.textContent).toBe('Closed');
    });
  });
});
