export const parseEstimation = (estimation: string): number => {
  const days = estimation.split('-').map(Number);
  return Math.max(...days);
};
