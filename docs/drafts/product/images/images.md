# Product images

Product images are shown in various places throughout the experience. Small icon-sized images appear in the typeahead search results and increase in size as you navigate to the listing page and product details page. Some products may require a fullscreen image or an image that can be used to zoom in to provide the needed level of visual detail.

To enable such a "responsive" setup, usually a single product image in different sizes is used. When the product is shown from different angles, multiple images are used. These images are represented as a so-called _image set_.

## Images and other media

While most products are represented by images, there are other visuals that can be used. For example, videos, documents, 3d-images, or vector images. While the core Spryker data model is designed around images, the client side data model is abstracted away from images to support other types of media.

## Optimized experiences for each user

Since users have different devices, network connections and screen sizes, images can be optimized for each specific case. This provides balance between high quality image and performance. Take into account the following optimization factors:

- Pixel density: pixel density varies per device. Modern devices support higher pixel density, so higher resolution images can be rendered. However, higher resolution images require more time to load.
- Fast vs slow connection: 4g or 5g connections are considered fast, whereas 3g and older are considered slow. Users with a slow connection are not served well with high resolution images, even though their devices may support higher pixel density.

Since product images are usually constraint in a container layout, screen size does not matter. The container size defines the image size rather than the screen size. The exception may be full size images that are used to render the image fullscreen.

**Note**: The describes quality factors are not relevant on the server side. At the server side, you can take a conservative approach to quality to improve the initial server side rendered page load. For crawlers, provide a high resolution image using different techniques.

## Configuration options

The following entities are involved in the image setup:

- `Size`
- `ProductMediaContainerSize`
- `MediaContext`
- `ProductMediaConfig`

### `Size`

The `Size` enum includes t-shirt size values that are used to identify media size without being too constraint about the exact pixel size. While the size comes in a range from `Xs` to `Xl`, Spryker provides images only in `Sm` and `Lg`. This is fine, as the sizes can be mapped to the so-called _container size_. Moreover, the model enables customizations either in the backend or by integrating third-party services.

### `ProductMediaContainerSize`

Each media can be used in different components. The source size was decoupled from the usage, so that multiple sizes can be mapped to the container size. The `ProductMediaContainerSize` enum includes four values:
| Size | Usage |
| --- | --- |
| `Icon` | Typeahead search response. |
| `Thumbnail` | Product lists, cart entry, wishlist, etc. |
| `Detail` | Detailed media on the product details page. |
| `Full` | Fullscreen or zoomed variation on the product details page. |

### `MediaContext`

The media context is used to specify quality constraints for a certain media. This enables optimized experiences based on user device and connection speed.

Breakpoints are explicitly not part of the context, since they do not contribute to the selection of product media. Product media are typically constraint by the layout, not by the screen size.

### `ProductMediaConfig`

A container size can be mapped to multiple sizes using different contexts. The following example shows two sources mapped to the icon format. The `Xs` size is used for any device, and the `Sm` size variation is used for users with high density devices and fast connection.

```ts
export const productMediaConfig: ProductMediaConfig = {
  icon: {
    sizes: [
      { size: Size.Xs },
      {
        context: {
          density: 2,
          connection: 'fast',
        },
        size: Size.Sm,
      },
    ],
  },
};
```
