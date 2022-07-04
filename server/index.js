const express = require("express");
const app = express();
const cors = require('cors')
app.use(express.json());
app.use(cors())
const db = require("./models");

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("uploads"));
// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
db.sequelize.sync({alter:true}).then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});