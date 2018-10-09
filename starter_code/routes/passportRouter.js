const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


//---GET´S----
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req,res,next)=>{
  res.render('../views/passport/signup.hbs')
});

//POST para traer la info del signup Y SE HACEN VALIDACIONES
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  //Si hay campos vacios no guarda
  if (username == "" || password == "") {
    res.render("auth/signup", {
      errorMessage: "Introduce usuario y contraseña"
    });
    return;
  }

  //SI USUARIO YA EXISTE NO DEBE GUARDAR y si si guarda
  User.findOne({
    "username": username
  }, "username", (error, user) => {
    if (user) {
      res.render("auth/signup", {
        errorMessage: "El usuario ya existe"
      })
      return
    }
    const newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      res.redirect("/");
    });
  })
})

module.exports = router;
