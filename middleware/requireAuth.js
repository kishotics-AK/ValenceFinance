function requireAuth(req, res, next) {
  const userId = req.session?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Please sign in to continue.' });
  }

  req.userId = userId;
  next();
}

module.exports = requireAuth;