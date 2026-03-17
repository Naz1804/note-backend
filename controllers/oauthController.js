const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});


exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return res.redirect(`${process.env.CALLBACK_URL}?error=auth_failed`);
    }

    if (!user) {
      return res.redirect(`${process.env.CALLBACK_URL}?error=no_user`);
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(`${process.env.REDIRECT_URL}?token=${token}`);
  })( req, res, next);
};