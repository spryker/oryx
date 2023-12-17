import { fixture } from '@open-wc/testing-helpers';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { Merchant, MerchantService } from '../src';
import { MerchantScheduleComponent } from './schedule.component';
import { merchantOpeningHoursComponent } from './schedule.def';
import { MerchantScheduleComponentOptions } from './schedule.model';

class MockMerchantService implements Partial<MerchantService> {
  get = vi.fn();
}

const lastWeek = new Date(new Date().setDate(new Date().getDate() - 6));
const lastMonth = new Date(new Date().setDate(new Date().getDate() - 20));
const lastQuarter = new Date(new Date().setDate(new Date().getDate() - 40));
const lastYear = new Date(new Date().setDate(new Date().getDate() - 190));
const twoYearsBack = new Date(new Date().setDate(new Date().getDate() - 400));
const aWeekAhead = new Date(new Date().setDate(new Date().getDate() + 4));
const aMonthAhead = new Date(new Date().setDate(new Date().getDate() + 20));
const aQuarterAhead = new Date(new Date().setDate(new Date().getDate() + 40));
const aYearAhead = new Date(new Date().setDate(new Date().getDate() + 180));
const twoYearsAhead = new Date(new Date().setDate(new Date().getDate() + 400));

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
      { date: lastWeek.toString() },
      { date: lastMonth.toString() },
      { date: lastQuarter.toString() },
      { date: lastYear.toString() },
      { date: twoYearsBack.toString() },
      { date: aWeekAhead.toString() },
      { date: aMonthAhead.toString() },
      { date: aQuarterAhead.toString() },
      { date: aYearAhead.toString() },
      { date: twoYearsAhead.toString() },
    ],
  },
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

    describe('and the component is not configured to render a specific schedule type', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-merchant-schedule merchant="1"></oryx-merchant-schedule>`
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
    });

    describe('and the component is configured to render weekdays', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-merchant-schedule
            merchant="1"
            .options=${{ type: 'weekdays' }}
          ></oryx-merchant-schedule>`
        );
      });

      it('should render only the weekdays heading', () => {
        const headings = element.shadowRoot?.querySelectorAll('oryx-heading');
        expect(headings?.length).toBe(1);
        expect(headings?.[0].textContent).toContain(
          i18n('merchant.schedule.weekdays')
        );
      });

      it('should render oryx-site-day elements', () => {
        expect(element).toContainElement('ul li oryx-site-day');
      });
    });

    describe('and the component is configured to render dates', () => {
      describe('and the component is not configured to filter any dates', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-merchant-schedule
              merchant="1"
              .options=${{ type: 'dates' }}
            ></oryx-merchant-schedule>`
          );
        });

        it('should render only the weekdays heading', () => {
          const headings = element.shadowRoot?.querySelectorAll('oryx-heading');
          expect(headings?.length).toBe(1);
          expect(headings?.[0].textContent).toContain(
            i18n('merchant.schedule.dates')
          );
        });

        it('should render oryx-site-date elements for all dates', () => {
          const dates = element.shadowRoot?.querySelectorAll('oryx-date');
          expect(dates?.length).toBe(10);
        });
      });

      describe('filterBefore', () => {
        describe('and the component is configured to filter before last week', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-merchant-schedule
                merchant="1"
                .options=${{
                  type: 'dates',
                  filterBefore: 'week',
                } as MerchantScheduleComponentOptions}
              ></oryx-merchant-schedule>`
            );
          });

          it('should render oryx-site-date elements for all dates', () => {
            const dates = element.shadowRoot?.querySelectorAll('oryx-date');
            expect(dates?.length).toBe(6);
          });
        });

        describe('and the component is configured to filter before last month', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-merchant-schedule
                merchant="1"
                .options=${{
                  type: 'dates',
                  filterBefore: 'month',
                } as MerchantScheduleComponentOptions}
              ></oryx-merchant-schedule>`
            );
          });

          it('should render oryx-site-date elements for all dates', () => {
            const dates = element.shadowRoot?.querySelectorAll('oryx-date');
            expect(dates?.length).toBe(7);
          });
        });

        describe('and the component is configured to filter before last quarter', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-merchant-schedule
                merchant="1"
                .options=${{
                  type: 'dates',
                  filterBefore: 'quarter',
                } as MerchantScheduleComponentOptions}
              ></oryx-merchant-schedule>`
            );
          });

          it('should render oryx-site-date elements for all dates', () => {
            const dates = element.shadowRoot?.querySelectorAll('oryx-date');
            expect(dates?.length).toBe(8);
          });
        });

        describe('and the component is configured to filter before last year', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-merchant-schedule
                merchant="1"
                .options=${{
                  type: 'dates',
                  filterBefore: 'year',
                } as MerchantScheduleComponentOptions}
              ></oryx-merchant-schedule>`
            );
          });

          it('should render oryx-site-date elements for all dates', () => {
            const dates = element.shadowRoot?.querySelectorAll('oryx-date');
            expect(dates?.length).toBe(9);
          });
        });
      });

      describe('filterAfter ', () => {
        describe('and the component is configured to filter after next week', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-merchant-schedule
                merchant="1"
                .options=${{
                  type: 'dates',
                  filterAfter: 'week',
                } as MerchantScheduleComponentOptions}
              ></oryx-merchant-schedule>`
            );
          });

          it('should render oryx-site-date elements for all dates', () => {
            const dates = element.shadowRoot?.querySelectorAll('oryx-date');
            expect(dates?.length).toBe(6);
          });
        });

        describe('and the component is configured to filter after next month', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-merchant-schedule
                merchant="1"
                .options=${{
                  type: 'dates',
                  filterAfter: 'month',
                } as MerchantScheduleComponentOptions}
              ></oryx-merchant-schedule>`
            );
          });

          it('should render oryx-site-date elements for all dates', () => {
            const dates = element.shadowRoot?.querySelectorAll('oryx-date');
            expect(dates?.length).toBe(7);
          });
        });

        describe('and the component is configured to filter after next quarter', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-merchant-schedule
                merchant="1"
                .options=${{
                  type: 'dates',
                  filterAfter: 'quarter',
                } as MerchantScheduleComponentOptions}
              ></oryx-merchant-schedule>`
            );
          });

          it('should render oryx-site-date elements for all dates', () => {
            const dates = element.shadowRoot?.querySelectorAll('oryx-date');
            expect(dates?.length).toBe(8);
          });
        });

        describe('and the component is configured to filter after next year', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<oryx-merchant-schedule
                merchant="1"
                .options=${{
                  type: 'dates',
                  filterAfter: 'year',
                } as MerchantScheduleComponentOptions}
              ></oryx-merchant-schedule>`
            );
          });

          it('should render oryx-site-date elements for all dates', () => {
            const dates = element.shadowRoot?.querySelectorAll('oryx-date');
            expect(dates?.length).toBe(9);
          });
        });
      });
    });
  });
});
