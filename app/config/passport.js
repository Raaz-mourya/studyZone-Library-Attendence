const LocalStrategy = require("passport-local").Strategy;
const Student = require("../models/student");
const bcrypt = require("bcrypt");

function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        // Login
        // Check if email exist
        const student = await Student.findOne({ email: email });
        if (!student) {
          return done(null, false, { message: "No student with this email" });
        }

        bcrypt
          .compare(password, student.password)
          .then((match) => {
            if (match) {
              return done(null, student, { message: "Logged in successfully" });
            }
            return done(null, false, { message: "Wrong email or password" });
          })
          .catch((err) => {
            return done(null, false, { message: "Something went wrong" });
          });
      }
    )
  );

  passport.serializeUser((student, done) => {
    done(null, student._id);
  });

  passport.deserializeUser((id, done) => {
    // const student = 
    // Student.findById(id).then((err, student)=> {
    //   done(err, student);
    // }).catch((err) => {
    //   return done(null, false, { message: "Something went wrong" });
    // })

    try {
      const student = Student.findById(id);
      done(null, student);
    }
    catch (err) {
      return done(null, false, { message: "Something went wrong" });
    }
  });
}

module.exports = init;
