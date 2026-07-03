const adminOnly = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "superadmin")) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin access required",
    });
  }

  next();
};

export default adminOnly;
