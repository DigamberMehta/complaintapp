const authMiddleware = (req, res, next) => {
  console.log("auth checked");
  next();
};

export default authMiddleware;
