const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  obj = {
    a: 2000,
  };
  res.json(obj);
});
module.exports = router;
