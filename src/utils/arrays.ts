export const calculateAverage = (arr: number[]): number => {
  const sum = arr.reduce((total, current) => total + current, 0);
  const average = sum / arr.length;
  return Math.round(average * 10) / 10;
};
