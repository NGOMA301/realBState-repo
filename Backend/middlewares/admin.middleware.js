export const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        code: 'FORBIDDEN',
        message: 'Admin privileges required'
      });
    }
    next();
  };