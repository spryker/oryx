import { RangeFacet } from '../../../../models';

export const facetsPriceConverter = (facet: RangeFacet): RangeFacet => {
  if (facet.parameter !== 'price') return facet;

  const { min, max, selected } = facet.values;

  return {
    ...facet,
    values: {
      min: Math.floor(min / 100),
      max: Math.ceil(max / 100),
      selected: {
        min: Math.floor(selected!.min / 100),
        max: Math.ceil(selected!.max / 100),
      },
    },
  };
};
