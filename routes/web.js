const homeController = require("../app/http/controllers/customers/homeController");
const authController = require("../app/http/controllers/customers/authController");
const guest = require("../app/http/middlewares/guest");

function initRoutes(app) {
  app.get("/", homeController().index);
  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);
  app.post("/logout", authController().logout);

  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);
}

module.exports = initRoutes;
