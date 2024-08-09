const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// All Admin Routes should only be accessble to logged in Admins!

router.get("/users/:role", async function (req, res, next) {
  let role = req.params.role;
  console.log("admin: ", req.session);

  if (!req.session.user || !req.session.user.isAdmin) {
    res.redirect("/");
  } else {
    let users = await userController.getUsers(role);

    res.render("users", {
      title: "Time 4 Trivia",
      user: req.session.user,
      isAdmin: req.session.isAdmin,
      users: users,
    });
  }
});

router.get("/delete/:userId", async function (req, res, next) {
  let userId = req.params.userId;
  if (!req.session.user || !req.session.isAdmin) {
    res.redirect("/");
  } else {
    await userController.deleteUserById(userId);
    res.redirect("/");
  }
});

router.post("/demote/:userId", async function (req, res, next) {

  let userId = req.body.userId;
  
  if ((req.session.user.userId != userId) && req.session.isAdmin) {
  await userController.demoteUser(userId);
  }

  res.redirect('/a/users/user')
})

// router.get('/drop', async function (req, res, next) {
//   console.log("dropping database!");
//   await userController.drop();

//   res.redirect('/');
// });

module.exports = router;
