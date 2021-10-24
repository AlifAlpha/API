const express = require("express");
const app = express();
const morgen = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Range"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    credentials: true,
  })
);

dotenv.config();

// db config
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB successfully connected");
  });

mongoose.connection.on("error", (err) => {
  console.log(`db connection error  : ${err.message}`);
});
// middelware
app.use(morgen("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

//bring routes
const leaveTypesRouter = require("./routers/leaveTypes");
const users = require("./routers/users");
const auth = require("./routers/auth");
const employeeRouter = require("./routers/employees");
const leave = require("./routers/leaves");
const department = require("./routers/department");
const itreq = require("./routers/itreq");
const itreqfrom = require("./routers/itreqform");
// const dgapp = require("./routers/dgapp");

app.use("/", leaveTypesRouter);
app.use("/", users);
app.use("/", auth);
app.use("/", employeeRouter);
app.use("/", leave);
app.use("/", department);
app.use("/", itreq);
app.use("/", itreqfrom);
// app.use("/", dgapp);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`node api listening to port : ${port}`);
});
