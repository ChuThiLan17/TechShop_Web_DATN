const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  // Bearer token
  // headers: { authorization: Bearer token}
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err)
        return res.status(401).json({
          success: false,
          mes: "Token truy cập không hợp lệ",
        });
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: "Yêu cầu xác thực!!!",
    });
  }
});

const isAdmin = asyncHandler((req, res, next) => {
  const { role } = req.user;
  if (+role !== 0)
    return res.status(401).json({
      success: false,
      mes: "YÊU CẦU VAI TRÒ ADMIN ",
    });
  next();
});

module.exports = {
  verifyAccessToken,
  isAdmin,
};
