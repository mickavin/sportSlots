const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/chat", require("./chat"));
router.use("/note", require("./note"));
router.use("/todo", require("./todo"));
router.use("/project", require("./project"));
router.use("/task", require("./task"));
router.use("/company", require("./company"));
router.use("/sport", require("./sport"));
router.use("/program", require("./program"));
router.use("/partner", require("./partner"));
router.use("/comment", require("./comment"));
router.use("/notification", require("./notification"));

module.exports = router;
