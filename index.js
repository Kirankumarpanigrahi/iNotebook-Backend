const express = require("express");
const path = require("path");
const connectToMongo = require("./db_connect");
connectToMongo();
const app = express();
const port = 5000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/api/notes", require("./Routes/notes"));
app.use("/api/auth", require("./Routes/auth"));
app.listen(port, () => {
  console.log(`inotebook app listening on http://localhost:${port}`);
});
