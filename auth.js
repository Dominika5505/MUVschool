module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Sem nemáš prístup");
    res.send("Sem nemáš prístup");
  }
};
