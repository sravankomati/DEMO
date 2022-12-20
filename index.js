const express = require("express");
const passport = require("passport");
const AmazonStrategy = require("passport-amazon").Strategy;
const cookieSession = require("cookie-session");
const app = express();
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use(
  new AmazonStrategy(
    {
      clientID: "amzn1.application-oa2-client.e463b3fbd6f940159deaed20e29e296e",
      clientSecret:
        "532da8a0c8c9517ceb017b9524171d451c20cc5661e00c5abe44039498cb1398",
      callbackURL: "http://localhost:8000/auth/amazon/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
        
      });
    }
  )
);
app.use(
  cookieSession({
    name: "amazon-auth-session",
    keys: ["key1", "key2"],
  })
);
app.use(passport.initialize());
app.use(passport.session());
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    // res.status(401).send('Not Logged In'); 
    res.redirect("/auth/amazon");
  }
}

app.get("/",isLoggedIn, (req, res) => {
  res.send(`<h1>Welcome  ${req.user.displayName}  </h1><button><a href="/logout">LogOut</a></button>`);
});
app.get("/auth/error", (req, res) => res.send("Unknown Error"));
app.get(
  "/auth/amazon",
  passport.authenticate("amazon", { scope: ["profile", "postal_code"] })
);
app.get(
  "/auth/amazon/callback",
  passport.authenticate("amazon", { failureRedirect: "/auth/error" }),
  function (req, res) {
    res.redirect("/");
  }
);
app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})
app.listen(8000, () => {
  console.log("server is started");
});
