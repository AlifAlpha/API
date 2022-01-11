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
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
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
const dgapp = require("./routers/dgApp");
const city = require("./routers/cities");
const room = require("./routers/rooms");
const notedg = require("./routers/internalNote");
const travelinfo = require("./routers/travelinfo");
const participation = require("./routers/participation");

app.use("/", leaveTypesRouter);
app.use("/", users);
app.use("/", auth);
app.use("/", employeeRouter);
app.use("/", leave);
app.use("/", department);
app.use("/", itreq);
app.use("/", itreqfrom);
app.use("/", dgapp);
app.use("/", city);
app.use("/", room);
app.use("/", notedg);
app.use("/", travelinfo);
app.use("/", participation);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Node API listening to port : ${port}`);
});
