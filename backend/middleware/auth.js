const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'Not authorized' });

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin)
      return res.status(401).json({ success: false, message: 'Not authorized' });

    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

module.exports = { protect };
