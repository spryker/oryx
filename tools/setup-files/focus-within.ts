((): void => {
  const CLASS_NAME = 'pseudo-focus-within-polyfilled';
  const RE = /:focus-within/gi;

  const computeEventPath = (node): HTMLElement[] => {
    const path = [node];
    let parent = null;

    while ((parent = node.parentNode || node.host || node.defaultView)) {
      path.push(parent);
      node = parent;
    }

    return path;
  };

  const handler = (e: Event): void => {
    if ('blur' === e.type) {
      Array.prototype.slice
        .call(computeEventPath(e.target))
        .forEach((el) => el?.classList?.remove(CLASS_NAME));
    } else if ('focus' === e.type) {
      Array.prototype.slice
        .call(computeEventPath(e.target))
        .forEach((el) => el?.classList?.add(CLASS_NAME));
    }
  };

  document.addEventListener('focus', handler, true);
  document.addEventListener('blur', handler, true);

  const originalMatches = Element.prototype.matches;
  Element.prototype.matches = function (selectors: string): boolean {
    return selectors.match(RE)
      ? this.classList.contains(CLASS_NAME)
      : originalMatches.call(this, selectors);
  };
})();
