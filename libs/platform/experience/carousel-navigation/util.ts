export function getDimensions(
  el: HTMLElement,
  isVertical = false
): { position: number; size: number } {
  const { left, top, width, height } = el.getBoundingClientRect();
  const size = isVertical ? height : width;
  const position = isVertical ? top : left;
  return { position, size };
}

export function getScrollDimensions(
  el: HTMLElement,
  isVertical = false
): { position: number; size: number } {
  const { scrollTop, scrollLeft, scrollHeight, scrollWidth } = el;
  const isRtl = window.getComputedStyle(el).direction === 'rtl';
  const position = isVertical ? scrollTop : scrollLeft * (isRtl ? -1 : 1);
  const size = isVertical ? scrollHeight : scrollWidth;
  return { position, size };
}

export function getComputedGapInPixels(
  element: HTMLElement,
  isVertical = false
): number {
  const gapProperty = isVertical ? 'row-gap' : 'column-gap';
  const computedStyle = window.getComputedStyle(element);
  const gapValue = computedStyle.getPropertyValue(gapProperty);

  if (gapValue === 'normal') {
    return 0;
  }

  const unit = gapValue.match(/[a-zA-Z%]+$/);
  let gapInPixels = parseFloat(gapValue);

  switch (unit ? unit[0] : null) {
    case 'em': {
      // Convert to pixels based on the font size
      const fontSize = parseFloat(computedStyle.fontSize);
      gapInPixels *= fontSize;
      break;
    }
    case 'rem': {
      // Convert to pixels based on the root font size
      const rootFontSize = parseFloat(
        computedStyle.getPropertyValue('font-size')
      );
      gapInPixels *= rootFontSize;
      break;
    }
    case 'px': {
      // Already in pixels, no conversion needed
      break;
    }
    case '%': {
      // Calculate gap as a percentage of the element's height (for vertical) or width (for horizontal)
      const dimension = isVertical ? 'height' : 'width';
      const elementSize = parseFloat(computedStyle[dimension]);
      if (!isNaN(elementSize)) {
        gapInPixels = (gapInPixels / 100) * elementSize;
      }
      break;
    }
    default: {
      // Handle other units as needed
      // You can add specific cases for other units you encounter
      break;
    }
  }

  return gapInPixels;
}
