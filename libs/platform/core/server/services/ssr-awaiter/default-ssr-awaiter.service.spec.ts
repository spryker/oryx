import { SSRAwaiterService } from '@spryker-oryx/core';
import { DefaultSSRAwaiterService } from './default-ssr-awaiter.service';

describe('DefaultSSRAwaiterService', () => {
  let service: SSRAwaiterService;

  beforeEach(() => {
    service = new DefaultSSRAwaiterService();
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
