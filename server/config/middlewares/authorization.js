
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    return res.redirect('/')
  }
  next()
}

/*
 * Check if logged in
 */

 exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
 }

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization : function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/users/'+req.profile.id)
    }
    next()
  },
  isLoggedIn: function (req, res, next) {
    return req.isAuthenticated();
  }
}

