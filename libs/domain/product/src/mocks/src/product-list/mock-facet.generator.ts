import { Facet, FacetValue } from '@spryker-oryx/product';

export function generateValues(
  count: number,
  prefix = 'Mock',
  selectedValues?: string[],
  disabledValues?: string[],
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
      disabled:
        (disabledValues && disabledValues?.indexOf(`${prefix}${i}`) >= 0) ??
        false,
    });
  }

  return values;
}

export const generateFacet = (
  name: string,
  parameter: string,
  valuesLength: number,
  selectedValues?: string[],
  disabledValues?: string[],
  children = false
): Facet => {
  return {
    name,
    parameter,
    valuesTreeLength: valuesLength,
    ...(selectedValues && { selectedValues }),
    values: generateValues(
      valuesLength,
      name,
      selectedValues,
      disabledValues,
      children
    ),
  };
};

export const generateRatingFacet = (
  selectedValues?: string[],
  disabledValues?: string[]
): Facet => {
  const values: FacetValue[] = [];

  for (let i = 1; i <= 5; i++) {
    values.push({
      value: String(i),
      selected: selectedValues?.includes(String(i)),
      count: 0,
      name: String(i),
      disabled: disabledValues?.includes(String(i)),
    });
  }

  return {
    name: 'Rating',
    parameter: 'rating[min]',
    valuesTreeLength: 5,
    values: values.reverse(),
  };
};
