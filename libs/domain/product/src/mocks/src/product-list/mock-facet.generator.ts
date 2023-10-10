import { Facet, FacetValue } from '@spryker-oryx/product';

export function generateValues(
  count: number,
  prefix = 'Mock',
  selectedValues?: string[],
  children?: boolean
): FacetValue[] {
  const values: FacetValue[] = [];

  for (let i = 0; i < count; i++) {
    values.push({
      value: `${prefix}${i}`,
      selected:
        (selectedValues && selectedValues?.indexOf(`${prefix}${i}`) >= 0) ??
        false,
      count: Number(`${i}0`),
      name: `${prefix}${i}`,
      ...(children ? { children: generateValues(3, `Sub-${prefix}`) } : {}),
    });
  }

  return values;
}

export const generateFacet = (
  name: string,
  parameter: string,
  valuesLength: number,
  selectedValues?: string[],
  children = false
): Facet => {
  return {
    name,
    parameter,
    valuesTreeLength: valuesLength,
    ...(selectedValues && { selectedValues }),
    values: generateValues(valuesLength, name, selectedValues, children),
  };
};

export const generateRatingFacet = (
  maxValue: number,
  selectedValues?: string[]
): Facet => {
  const values: FacetValue[] = [];

  for (let i = 1; i <= maxValue; i++) {
    const value = String(i);
    values.push({
      value,
      selected: selectedValues?.includes(value),
      count: 0,
      name: value,
    });
  }

  return {
    name: 'Rating',
    parameter: 'rating[min]',
    valuesTreeLength: maxValue,
    values: values.reverse(),
  };
};
