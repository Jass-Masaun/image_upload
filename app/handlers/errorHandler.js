const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.status === false) {
    res.status(err.status_code).json(err);
  }
};

module.exports = {
  errorHandler,
};
