const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

  try {

    const token =
      req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message:
          "No Token Provided",
      });
    }

    const verified =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user = verified;

    next();

  } catch (err) {

    console.log(err);

    res.status(401).json({
      message:
        "Unauthorized Access",
    });
  }
};

module.exports = auth;