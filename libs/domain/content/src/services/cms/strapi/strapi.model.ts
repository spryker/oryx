import { ContentAdapter } from '@spryker-oryx/content';

export const StrapiToken = 'oryx.StrapiToken';
export const StrapiApiUrl = 'oryx.StrapiApiUrl';
export const StrapiContentAdapter = `${ContentAdapter}strapi`;

declare global {
  interface Environment {
    readonly ORYX_STRAPI_TOKEN?: string;
    readonly ORYX_STRAPI_API_URL?: string;
  }

  interface InjectionTokensContractMap {
    [StrapiToken]: string;
    [StrapiApiUrl]: string;
  }
}
