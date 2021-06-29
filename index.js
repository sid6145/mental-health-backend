const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

const port = process.env.PORT || 5000;
//import routes
const userAuthRoute = require("./routes/userauth");
const doctorAuthRoute = require("./routes/docauth");
const appointmentRoute = require("./routes/appointments");
const activityRoute = require("./routes/activity");
const postRoute = require("./routes/posts");
const mailRoute = require("./routes/mail");

dotenv.config();

//connect db
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

//middlewares
app.use(express.json());
app.use(cors());

//route Middlewares
app.use("/api/user", userAuthRoute);
app.use("/api/doctor", doctorAuthRoute);
app.use("/api/appointment", appointmentRoute);
app.use("/api/activity", activityRoute);
app.use("/api/post", postRoute);
app.use("/api/mail", mailRoute);

app.get("/", (req, res) => {
  res.send("hello")
})

app.listen(port, function () {
  console.log(`server started on port ${port}`);
});
