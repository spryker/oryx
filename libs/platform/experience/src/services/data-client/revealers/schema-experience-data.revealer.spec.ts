import { nextFrame } from '@open-wc/testing-helpers';
import { App, AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { ComponentsPlugin } from '@spryker-oryx/utilities';
import { of } from 'rxjs';
import { MessageType } from '../data-client.model';
import { SchemaExperienceDataRevealer } from './schema-experience-data.revealer';

const mockAppFn = {
  getComponentSchemas: vi.fn().mockReturnValue(of([])),
};

const mockApp: Partial<App> = {
  requirePlugin: vi.fn().mockReturnValue(mockAppFn),
};

describe('SchemaExperienceDataRevealer', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: AppRef,
          useValue: mockApp,
        },
        {
          provide: 'service',
          useClass: SchemaExperienceDataRevealer,
        },
      ],
    });
    vi.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('reveal', () => {
    it('should send `MessageType.ComponentSchemas` post message', async () => {
      const mockSchemaA = { b: 'b' };
      const mockSchemaB = { b: 'b' };
      mockAppFn.getComponentSchemas.mockReturnValue(
        of([mockSchemaA, mockSchemaB])
      );
      getInjector().inject('service').reveal().subscribe();
      await nextFrame();
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.ComponentSchemas,
          data: [mockSchemaA, mockSchemaB],
        },
        '*'
      );
      expect(mockAppFn.getComponentSchemas).toHaveBeenCalled();
      expect(mockApp.requirePlugin).toHaveBeenCalledWith(ComponentsPlugin);
    });
  });
});
