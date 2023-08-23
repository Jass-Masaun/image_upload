const getTwoDateDifferenceInMs = (newDate, oldDate) => {
  const date1 = new Date(newDate);
  const date2 = new Date(oldDate);

  return Math.abs(date2 - date1);
};

module.exports = {
  getTwoDateDifferenceInMs,
};
