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

export const MOCK_ROUTER_PROVIDERS = [
  {
    provide: RouterService,
    useClass: MockRouterService,
  },
];
