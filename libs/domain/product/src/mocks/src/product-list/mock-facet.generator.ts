import {
  Facet,
  FacetType,
  FacetValue,
  RangeFacet,
  ValueFacet,
} from '@spryker-oryx/product';

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
      count: Number(`${i + 1}0`),
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
): ValueFacet => {
  return {
    name,
    parameter,
    valuesTreeLength: valuesLength,
    ...(selectedValues && { selectedValues }),
    values: generateValues(valuesLength, name, selectedValues, children),
    type: FacetType.Single,
  };
};

export const generateRange = (
  name: string,
  parameter: string,
  range: number[],
  selected?: number[]
): RangeFacet => {
  const [min, max] = range;
  return {
    name,
    parameter,
    values: {
      min,
      max,
      selected: { min: +(selected?.[0] ?? min), max: +(selected?.[1] ?? max) },
    },
    type: FacetType.Range,
  };
};