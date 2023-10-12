// import { facetsRangeNormalizer } from '../../product/src/services/adapter/converters/facet-price/facet-price.converter';

// const mockRangeFacets = [
//   {
//     activeMax: 36660,
//     activeMin: 175,
//     config: { parameterName: 'price', isMultiValued: false },
//     docCount: 2,
//     localizedName: 'Price range',
//     max: 36660,
//     min: 175,
//     name: 'price-DEFAULT-EUR-GROSS_MODE',
//   },
// ];

// const invalidRangeFacets = [
//   {
//     activeMax: 1,
//     activeMin: 1,
//     config: { parameterName: 'mock', isMultiValued: false },
//     docCount: 2,
//     localizedName: 'mock',
//     max: 1,
//     min: 1,
//     name: 'mock',
//   },
// ];

// describe('Product Facet Normalizers', () => {
//   it('should return normalized product facet-navigation', () => {
//     expect(facetsRangeNormalizer(mockRangeFacets)).toEqual([
//       {
//         type: 'range',
//         parameter: 'price',
//         name: 'Price range',
//         values: {
//           max: 36660,
//           min: 175,
//           selected: {
//             max: 36660,
//             min: 175,
//           },
//         },
//       },
//     ]);
//   });

//   it('should ignore invalid range facet', () => {
//     expect(facetsRangeNormalizer(invalidRangeFacets)).toEqual([]);
//   });
// });
