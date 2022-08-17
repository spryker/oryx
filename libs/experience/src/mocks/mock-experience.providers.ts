import { RouterService } from '../services';

class MockRouterService implements Partial<RouterService> {
  go(): void {
    //mock
  }
  back(): void {
    //mock
  }
  navigate(): void {
    //mock
  }
}

export const mockRouterProviders = [
  {
    provide: RouterService,
    useClass: MockRouterService,
  },
];
