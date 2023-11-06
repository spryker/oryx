import {
  inject,
  Injector,
  INJECTOR,
  OnDestroy,
  Provider,
} from '@spryker-oryx/di';
import {
  InferOauthConfig,
  OauthGrantType,
  OauthProviderConfig,
} from './config.model';
import { InferOauthProvider, OauthProvider } from './provider.model';

export interface OauthProviderFactoryService {
  create<T extends OauthGrantType>(
    config: InferOauthConfig<T>
  ): Promise<InferOauthProvider<T>>;
}

export const OauthProviderFactoryService = 'oryx.OauthProviderFactoryService';

declare global {
  interface InjectionTokensContractMap {
    [OauthProviderFactoryService]: OauthProviderFactoryService;
    [OauthProviderRegistry]: OauthProviderRegistry;
  }
}

export class DefaultOauthProviderFactoryService
  implements OauthProviderFactoryService, OnDestroy
{
  protected static PROVIDER_TOKEN = {
    __isProviderToken: true,
  } as unknown as OauthProvider;

  protected injectorMap = new Map<string, Injector>();

  constructor(
    protected readonly providerRegistry = inject(OauthProviderRegistry, null),
    protected readonly injector = inject(INJECTOR)
  ) {}

  async create<T extends OauthGrantType>(
    config: InferOauthConfig<T>
  ): Promise<InferOauthProvider<T>> {
    if (this.injectorMap.has(config.id)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.injectorMap
        .get(config.id)!
        .inject(DefaultOauthProviderFactoryService.PROVIDER_TOKEN);
    }

    const provider = this.providerRegistry?.find(
      this.getProviderMatcher(config)
    ) as OauthProviderRegistry<T>;

    if (!provider) {
      throw new Error(`Unknown Oauth grant type '${config.grantType}'!`);
    }

    const factory = await provider.resolver();

    const injector = new Injector(
      [
        {
          provide: DefaultOauthProviderFactoryService.PROVIDER_TOKEN,
          useFactory: () => factory(config),
        },
      ],
      this.injector
    );

    this.injectorMap.set(config.id, injector);

    const instance = injector.inject(
      DefaultOauthProviderFactoryService.PROVIDER_TOKEN
    );

    return instance;
  }

  onDestroy(): void {
    this.injectorMap.forEach((injector) => injector.destroy());
    this.injectorMap.clear();
  }

  protected getProviderMatcher(
    config: OauthProviderConfig
  ): (provider: OauthProviderRegistry) => boolean {
    return (provider) =>
      provider.grantType === config.grantType &&
      (!provider.extraMatcher ||
        provider.extraMatcher(config as InferOauthConfig<never>));
  }
}

export interface OauthProviderRegistry<T = OauthGrantType> {
  grantType: T;
  resolver(): Promise<OauthProviderFactory<T>>;
  extraMatcher?(config: InferOauthConfig<T>): boolean;
}

export interface OauthProviderFactory<T> {
  (config: InferOauthConfig<T>): InferOauthProvider<T>;
}

export const OauthProviderRegistry = 'oryx.OauthProviderRegistry*';

export function provideOauthProvider<T extends OauthGrantType>(
  grantType: T,
  resolver: OauthProviderRegistry<T>['resolver'],
  extraMatcher?: OauthProviderRegistry<T>['extraMatcher']
): Provider[] {
  return [
    {
      provide: OauthProviderRegistry,
      useValue: {
        grantType,
        resolver,
        extraMatcher,
      } as OauthProviderRegistry<T>,
    },
  ];
}
