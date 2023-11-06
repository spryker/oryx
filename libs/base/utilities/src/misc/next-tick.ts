export const nextTick = async (tickCount = 0): Promise<void> => {
  for (let i = 1; i <= tickCount; i++) {
    await Promise.resolve();
  }
};
