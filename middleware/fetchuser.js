const jwt = require("jsonwebtoken");
const jwt_secret = "kiranisagoodboy";
const fetchuser = async (req, res, next) => {
  //Get the user from the jwt token and append the id
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid user" });
  }
  try {
    const data = await jwt.verify(token, jwt_secret);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid user" });
  }
};

module.exports = fetchuser;
