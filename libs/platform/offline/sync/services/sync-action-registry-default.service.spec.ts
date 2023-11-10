import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { SyncStatus } from '../models';
import { SyncActionRegistryDefaultService } from './sync-action-registry-default.service';
import { SyncActionRegistryService } from './sync-action-registry.service';

export const mockSync = {
  action: 'mock' as any,
  id: 123,
  prevSyncIds: [],
  status: SyncStatus.Processing,
  payload: {} as any,
  scheduledAt: new Date(),
  retries: 0,
  errors: [],
  whenCompleted: vi.fn(),
  cancel: vi.fn(),
  handleSync: vi.fn().mockReturnValue(of(undefined)),
  isSyncing: vi.fn().mockReturnValue(of(false)),
};

describe('SyncActionRegistryDefaultService', () => {
  let service: SyncActionRegistryService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: SyncActionRegistryService,
          useClass: SyncActionRegistryDefaultService,
        },
      ],
    });

    service = testInjector.inject(SyncActionRegistryService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(SyncActionRegistryDefaultService);
  });

  describe('when handling an action', () => {
    const callback = vi.fn();
    describe('and the action is not registered', () => {
      it('should throw an error', () => {
        service.handleSync(mockSync).subscribe({ error: callback });

        expect(callback).toHaveBeenCalledWith(
          new Error(
            `SyncActionRegistryDefaultService: Sync with action 'mock' cannot be handled by any handler!`
          )
        );
      });
    });

    describe('and the action is registered', () => {
      beforeEach(() => {
        service.register(mockSync.action, mockSync);
      });

      it('should not throw error', () => {
        service.handleSync(mockSync).subscribe(callback);

        expect(callback).toHaveBeenCalled();
      });

      it('should call handler handleSync', () => {
        service.handleSync(mockSync).subscribe(callback);

        expect(mockSync.handleSync).toHaveBeenCalledWith(mockSync);
      });
    });
  });
});
