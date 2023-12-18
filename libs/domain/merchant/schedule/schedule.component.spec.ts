import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { Merchant, MerchantService } from '../src';
import { MerchantScheduleComponent } from './schedule.component';
import { merchantScheduleComponent } from './schedule.def';

class MockMerchantService implements Partial<MerchantService> {
  get = vi.fn();
}

const twoWeeksAgo = new Date(new Date().setDate(new Date().getDate() - 14));
const oneWeeksAgo = new Date(new Date().setDate(new Date().getDate() - 7));
const oneWeeksAhead = new Date(new Date().setDate(new Date().getDate() + 7));
const twoWeeksAhead = new Date(new Date().setDate(new Date().getDate() + 14));

const mockMerchant: Partial<Merchant> = {
  id: '1',
  schedule: {
    weekdays: [
      {
        day: 'monday',
        times: [
          { from: '07:00:00.000000', to: '13:00:00.000000' },
          { from: '14:00:00.000000', to: '20:00:00.000000' },
        ],
      },
      {
        day: 'tuesday',
        times: [{ from: '07:00:00.000000', to: '20:00:00.000000' }],
      },
      {
        day: 'wednesday',
        times: [{ from: '07:00:00.000000', to: '20:00:00.000000' }],
      },
      {
        day: 'thursday',
        times: [{ from: '07:00:00.000000', to: '20:00:00.000000' }],
      },
      {
        day: 'friday',
        times: [{ from: '07:00:00.000000', to: '20:00:00.000000' }],
      },
      {
        day: 'saturday',
        times: [{ from: '07:00:00.000000', to: '20:00:00.000000' }],
      },
      {
        day: 'sunday',
      },
    ],
    dates: [
      { date: twoWeeksAgo.toString() },
      { date: oneWeeksAgo.toString() },
      { date: oneWeeksAhead.toString() },
      { date: twoWeeksAhead.toString() },
    ],
  },
};

describe('MerchantScheduleComponent', () => {
  let element: MerchantScheduleComponent;
  let merchantService: MockMerchantService;

  beforeAll(async () => {
    await useComponent(merchantScheduleComponent);
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
    const contextService = injector.inject(ContextService);
    contextService.provide(document.body, 'merchant', { id: '1' });
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when no schedule is provided', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(of({ id: '1' }));

      element = await fixture(
        html`<oryx-merchant-schedule merchant="1"></oryx-merchant-schedule>`
      );
    });

    it('should not render any heading', () => {
      expect(element).not.toContainElement('oryx-heading');
    });

    it('should not render any slots', () => {
      expect(element).not.toContainElement('ul');
    });
  });

  describe('when a schedule is provided', () => {
    beforeEach(async () => {
      merchantService.get.mockReturnValue(of(mockMerchant));
    });

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-merchant-schedule></oryx-merchant-schedule>`
      );
    });

    it('should render the weekdays heading', () => {
      const headings = element.shadowRoot?.querySelectorAll('oryx-heading');
      expect(headings?.[0].textContent).toContain(
        i18n('merchant.schedule.weekdays')
      );
    });

    it('should render oryx-site-day elements', () => {
      expect(element).toContainElement('ul li oryx-site-day');
    });

    it('should render the dates heading', () => {
      const headings = element.shadowRoot?.querySelectorAll('oryx-heading');
      expect(headings?.[1].textContent).toContain(
        i18n('merchant.schedule.dates')
      );
    });

    it('should render oryx-site-date elements', () => {
      expect(element).toContainElement('ul li oryx-date');
    });

    describe('when the weeksBefore = 0 and weeksAfter = 2', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-merchant-schedule
            merchant="0"
            .options=${{ weeksBefore: 0, weeksAfter: 2 }}
          ></oryx-merchant-schedule>`
        );
      });

      it('should render only the future dates', () => {
        const dates = element.shadowRoot?.querySelectorAll('oryx-date');
        expect(dates?.length).toBe(2);
      });
    });

    describe('when the weeksBefore = 1 and weeksAfter = 2', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-merchant-schedule
            merchant="1"
            .options=${{ weeksBefore: 1 }}
          ></oryx-merchant-schedule>`
        );
      });

      it('should render 1 past date and 2 future', () => {
        const dates = element.shadowRoot?.querySelectorAll('oryx-date');
        expect(dates?.length).toBe(3);
      });
    });

    describe('when the weeksBefore = 2 and weeksAfter = 2', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-merchant-schedule
            merchant="1"
            .options=${{ weeksBefore: 2 }}
          ></oryx-merchant-schedule>`
        );
      });

      it('should render 2 past date and 2 future', () => {
        const dates = element.shadowRoot?.querySelectorAll('oryx-date');
        expect(dates?.length).toBe(4);
      });
    });

    describe('when the weeksBefore = 0 and weeksBefore = 0', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-merchant-schedule
            merchant="0"
            .options=${{ weeksBefore: 0, weeksAfter: 0 }}
          ></oryx-merchant-schedule>`
        );
      });

      it('should render only the future dates', () => {
        const dates = element.shadowRoot?.querySelectorAll('oryx-date');
        expect(dates?.length).toBe(0);
      });
    });

    describe('when the weeksBefore = 0 and weeksAfter = 2', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-merchant-schedule
            merchant="1"
            .options=${{ weeksBefore: 0, weeksAfter: 2 }}
          ></oryx-merchant-schedule>`
        );
      });

      it('should render 2 past date and 2 future', () => {
        const dates = element.shadowRoot?.querySelectorAll('oryx-date');
        expect(dates?.length).toBe(2);
      });
    });

    describe('when the weeksBefore = 0 and weeksAfter = 1', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-merchant-schedule
            merchant="1"
            .options=${{ weeksBefore: 0, weeksAfter: 1 }}
          ></oryx-merchant-schedule>`
        );
      });

      it('should render 2 past date and 2 future', () => {
        const dates = element.shadowRoot?.querySelectorAll('oryx-date');
        expect(dates?.length).toBe(1);
      });
    });

    describe('when the weeksBefore = 1 and weeksAfter = 1', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-merchant-schedule
            merchant="1"
            .options=${{ weeksBefore: 1, weeksAfter: 1 }}
          ></oryx-merchant-schedule>`
        );
      });

      it('should render 2 past date and 2 future', () => {
        const dates = element.shadowRoot?.querySelectorAll('oryx-date');
        expect(dates?.length).toBe(2);
      });
    });
  });
});
