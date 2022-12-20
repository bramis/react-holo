const getPercentage = (value: number, totalValue: number = 100) => {
  const fixedValue = ((value * 100) / totalValue).toFixed(2);
  return parseFloat(fixedValue);
};

export default getPercentage;
