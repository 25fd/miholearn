const jwt = require('jsonwebtoken');
const AuthToken = require('../models/authTokenModel');
exports.protect = async (req, res, next) => {

  let token;
  console.log(req.headers.authorization);
    if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    const activeUser = await AuthToken.findOne({ userId: decode.id });
    console.log(activeUser);
    if (!activeUser || (activeUser.deviceId !== decode.deviceId) || (activeUser.token !== token)) {
      return res.sendError(403, 'invlid token');
    }
    next();
  } catch (e) {
    console.log(e);
    return res.sendError(403, 'invlid token');
  }
}