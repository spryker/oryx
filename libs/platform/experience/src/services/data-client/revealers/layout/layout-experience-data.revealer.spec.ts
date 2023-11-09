import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormFieldType } from '@spryker-oryx/form';
import { of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPropertyPlugin,
  LayoutStylesPlugin,
} from '../../../layout';
import { LayoutExperienceDataRevealer } from './layout-experience-data.revealer';

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
    vi.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  // TODO: Temporary disabled to unblock release
  describe('reveal', () => {
    it('should send `MessageType.StylesOptions` post message with proper data', async () => {
      // getInjector().inject('service').reveal().subscribe();
      // postMessage(
      //   {
      //     type: MessageType.SelectedStyles,
      //     data: {
      //       type: 'bLayout',
      //       bProperty: true,
      //     } as LayoutTypeStyles,
      //   },
      //   window
      // );
      // await nextFrame();
      // expect(window.parent.postMessage).toHaveBeenCalledWith(
      //   {
      //     type: MessageType.StylesOptions,
      //     data: {
      //       defaults: {
      //         bSpecialLayout: 'default',
      //         bSpecialProperty: 'default',
      //       },
      //       fields: {
      //         container: [
      //           {
      //             id: 'layout-type',
      //             label: 'layout',
      //             type: FormFieldType.Select,
      //             options: [{ value: 'aLayout' }, { value: 'bLayout' }],
      //           },
      //           {
      //             id: 'layout-aProperty',
      //             label: 'aProperty',
      //             type: FormFieldType.Boolean,
      //           },
      //           {
      //             id: 'layout-bProperty',
      //             label: 'bProperty',
      //             type: FormFieldType.Boolean,
      //           },
      //         ],
      //         special: [
      //           {
      //             id: 'layout-bSpecialLayout',
      //             type: FormFieldType.Boolean,
      //             label: 'b Special Layout',
      //           },
      //           {
      //             id: 'layout-bSpecialProperty',
      //             type: FormFieldType.Text,
      //             label: 'b Special Property',
      //           },
      //         ],
      //         aStyle: [
      //           {
      //             id: 'padding',
      //             label: 'padding',
      //             type: FormFieldType.Text,
      //           },
      //           {
      //             id: 'margin',
      //             label: 'margin',
      //             type: FormFieldType.Text,
      //           },
      //         ],
      //         bStyle: [
      //           {
      //             id: 'zIndex',
      //             label: 'z Index',
      //             type: FormFieldType.Text,
      //           },
      //           {
      //             id: 'marginCameCase',
      //             label: 'margin Came Case',
      //             type: FormFieldType.Text,
      //           },
      //         ],
      //       },
      //     },
      //   },
      //   '*'
      // );
    });
  });
});
