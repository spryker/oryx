export const FacetColorsMapping = 'oryx.OryxFacetColorsMapping*';

export const colorsMap = {
  platinum: 'rgb(229, 228, 226)',
  copper: 'rgb(153, 98, 43)',
};

declare global {
  interface InjectionTokensContractMap {
    [FacetColorsMapping]: Record<string, string>;
  }
}
