import { describe, expect, it } from 'vitest';
import { launchpadUi } from './launchpad-ui';

describe('launchpadUi', () => {
  it('should work', () => {
    expect(launchpadUi()).toBeDefined();
  });
});
