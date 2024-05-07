
const jwt = require('jsonwebtoken');
const User = require('./models/UserModel');

const jwtCheck = async (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, 'secret');
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = decoded;
    req.userName = user.name;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = jwtCheck;
