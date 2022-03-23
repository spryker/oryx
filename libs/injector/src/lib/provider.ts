export type Provider = ClassProvider | ValueProvider | FactoryProvider;

export interface ClassProvider {
  provide: any;
  useClass: any;
}

export interface ValueProvider {
  provide: any;
  useValue: any;
}

export interface FactoryProvider {
  provide: any;
  useFactory: () => any;
}
