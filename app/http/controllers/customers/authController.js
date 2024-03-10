const Student = require("../../../models/student");
const bcrypt = require("bcrypt");
const passport = require("passport");

function authController() {
  return {
    login(req, res) {
      res.render("auth/login");
    },

    postLogin(req, res, next) {
      passport.authenticate("local", (err, student, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!student) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }
        req.login(student, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          return res.redirect("/");
        });
      })(req, res, next);
    },

    register(req, res) {
      res.render("auth/register");
    },

    async postRegister(req, res) {
      const { name, seatNumber, email, password, phone, dob } = req.body;

      // Validate request
      if (!name || !email || !password || !phone || !dob) {
        req.flash("error", "All fields are required");
        req.flash("name", name);
        req.flash("seatNumber", seatNumber);
        req.flash("email", email);
        req.flash("phone", phone);
        req.flash("dob", dob);
        return res.redirect("/register");
      }

      // check if email exist

      const docs = await Student.exists({ email: email });
      console.log(docs);
      if (docs) {
        req.flash("error", "Email already taken");
        req.flash("name", name);
        req.flash("seatNumber", seatNumber);
        req.flash("email", email);
        req.flash("phone", phone);
        req.flash("dob", dob);
        return res.redirect("/register");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create new student
      const student = new Student({
        name,
        seatNumber,
        email,
        phone,
        dob,
        password: hashedPassword,
      });

      student
        .save()
        .then((student) => {
          //Login

          console.log(student);
          // new Noty({
          //   text: "Registration successful",
          //   type: 'success',
          //   timeout: 500,
          //   progressBar: false,
          //   layout: 'topRight'
          // }).show();

          return res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "Something went wrong");
          return res.redirect("/register");
        });
    },

    logout(req, res) {
      // req.session.destroy;


      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/login");
      });

    },
  };
}

module.exports = authController;
