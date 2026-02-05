const loggerMiddleware = (req, res, next) => {
  console.log(`logger ${req.method} ${req.url}`);
  next();
};

export default loggerMiddleware;
