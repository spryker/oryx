import { SSRAwaiterContract } from '@spryker-oryx/core';
import { SSRAwaiterService } from './ssr-awaiter.service';

describe('SSRAwaiterService', () => {
  let service: SSRAwaiterContract;

  beforeEach(() => {
    service = new SSRAwaiterService();
  });

  it('getAwaiter method should add awaiter', () => {
    expect(service.hasAwaiter()).toBe(false);

    service.getAwaiter();

    expect(service.hasAwaiter()).toBe(true);
  });

  it('await method should resolve all awaiters and clear them', async () => {
    const resolve = service.getAwaiter();
    resolve();

    expect(service.hasAwaiter()).toBe(true);

    await service.await();

    expect(service.hasAwaiter()).toBe(false);
  });
});
