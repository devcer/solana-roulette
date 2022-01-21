const getReturnAmount = (stake, ratio) => {
  const ratioArr = ratio.split(":");
  return stake * (parseFloat(ratioArr[1]) / parseFloat(ratioArr[0]));
};

const totalAmtToBePaid = (stake) => {
  return stake;
};

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = { getReturnAmount, totalAmtToBePaid, randomNumber };
