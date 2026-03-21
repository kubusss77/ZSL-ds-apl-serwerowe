const { db } = require('./server');

function isAuthenticated(req, res, next) {
  const userId = req.session.userId;
  console.log('Checking authentication for user ID:', userId);
  if (!userId) {
    console.log('No user ID in session');
    res.redirect('/login?error=not_authenticated');
    return;
  }

  db.findOne({ _id: userId }, (error, user) => {
    if (error) {
      console.error('Database error:', error);
      res.redirect('/login');
      return;
    }
    if (!user) {
      console.log('User not found');
      res.redirect('/login');
      return;
    }
    req.session.username = user.login;
    next();
  });
}

module.exports = {
  isAuthenticated,
};
