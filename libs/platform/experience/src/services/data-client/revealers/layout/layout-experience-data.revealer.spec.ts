import { nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { FormFieldType } from '@spryker-oryx/form';
import { BehaviorSubject, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPropertyPlugin,
  LayoutStylesPlugin,
  LayoutTypeStyles,
} from '../../../layout';
import { ExperienceLayoutData } from '../../data-client.model';
import { LayoutExperienceDataRevealer } from './layout-experience-data.revealer';

const utils = {
  postMessage: vi.fn(),
  catchMessage: vi.fn(),
};

vi.mock('../../utilities', () => ({
  postMessage: (data: unknown) => utils.postMessage(data),
  catchMessage: (data: unknown) => utils.catchMessage(data),
}));

const mockALayout: LayoutPlugin = {
  getConfig: vi.fn().mockReturnValue(of({ schema: { name: 'aLayout' } })),
};

const mockBLayout: LayoutPlugin = {
  getConfig: vi.fn().mockReturnValue(
    of({
      schema: {
        name: 'bLayout',
        options: {
          bSpecialLayout: { type: FormFieldType.Boolean },
        },
      },
    })
  ),
  getDefaultProperties: vi
    .fn()
    .mockReturnValue(of({ bSpecialLayout: 'default' })),
};

const mockAProperties: LayoutPlugin = {
  getConfig: vi.fn().mockReturnValue(of({ schema: { name: 'aProperty' } })),
};

const mockBProperties: LayoutPlugin = {
  getConfig: vi.fn().mockReturnValue(
    of({
      schema: {
        name: 'bProperty',
        options: {
          bSpecialProperty: { type: FormFieldType.Text },
        },
      },
    })
  ),
  getDefaultProperties: vi
    .fn()
    .mockReturnValue(of({ bSpecialProperty: 'default' })),
};

const mockAStyles: LayoutPlugin = {
  getConfig: vi.fn().mockReturnValue(
    of({
      schema: {
        name: 'aStyle',
        options: {
          padding: { type: FormFieldType.Text },
          margin: { type: FormFieldType.Text },
        },
      },
    })
  ),
};

const mockBStyles: LayoutPlugin = {
  getConfig: vi.fn().mockReturnValue(
    of({
      schema: {
        name: 'bStyle',
        options: {
          zIndex: { type: FormFieldType.Text },
          marginCameCase: { type: FormFieldType.Text },
        },
      },
    })
  ),
};

describe('LayoutExperienceDataRevealer', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: 'service',
          useClass: LayoutExperienceDataRevealer,
        },
        {
          provide: LayoutPlugin,
          useValue: mockALayout,
        },
        {
          provide: LayoutPlugin,
          useValue: mockBLayout,
        },
        {
          provide: LayoutPropertyPlugin,
          useValue: mockAProperties,
        },
        {
          provide: LayoutPropertyPlugin,
          useValue: mockBProperties,
        },
        {
          provide: LayoutStylesPlugin,
          useValue: mockAStyles,
        },
        {
          provide: LayoutStylesPlugin,
          useValue: mockBStyles,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('reveal', () => {
    it('should send create proper object depends on active layout styles', async () => {
      const catchTrigger = new BehaviorSubject<LayoutTypeStyles>({
        type: 'bLayout',
        bProperty: true,
      } as LayoutTypeStyles);
      utils.catchMessage.mockReturnValue(catchTrigger);
      let expected = {} as ExperienceLayoutData;
      getInjector()
        .inject('service')
        .reveal()
        .subscribe((data: ExperienceLayoutData) => {
          expected = data;
        });
      await nextFrame();
      expect(expected.defaults).toEqual({
        bSpecialLayout: 'default',
        bSpecialProperty: 'default',
      });
      expect(expected.fields.container).toEqual([
        {
          id: 'layout-type',
          label: 'layout',
          type: FormFieldType.Select,
          options: [{ value: 'aLayout' }, { value: 'bLayout' }],
        },
        {
          id: 'layout-aProperty',
          label: 'aProperty',
          type: FormFieldType.Boolean,
        },
        {
          id: 'layout-bProperty',
          label: 'bProperty',
          type: FormFieldType.Boolean,
        },
      ]);
      expect(expected.fields.special).toEqual([
        {
          id: 'layout-bSpecialLayout',
          type: FormFieldType.Boolean,
          label: 'b Special Layout',
        },
        {
          id: 'layout-bSpecialProperty',
          type: FormFieldType.Text,
          label: 'b Special Property',
        },
      ]);
      expect(expected.fields.aStyle).toEqual([
        {
          id: 'padding',
          label: 'padding',
          type: FormFieldType.Text,
        },
        {
          id: 'margin',
          label: 'margin',
          type: FormFieldType.Text,
        },
      ]);
      expect(expected.fields.bStyle).toEqual([
        {
          id: 'zIndex',
          label: 'z Index',
          type: FormFieldType.Text,
        },
        {
          id: 'marginCameCase',
          label: 'margin Came Case',
          type: FormFieldType.Text,
        },
      ]);
    });
  });
});
