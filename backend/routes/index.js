const router = require("express").Router();

// auth
router.use("/auth", require("./auth"));

// todo
router.use("/todo", require("./todo"));

module.exports = router;


