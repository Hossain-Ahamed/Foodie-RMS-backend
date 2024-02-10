const dotenv = require("dotenv");
const express = require("express");
const app = express();
const connectDB = require("./server/config/database");
const cors = require("cors");
const AdminRoute = require("./server/route/adminRoute");
const UserRoute = require("./server/route/userRoute");

dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 5000;

connectDB();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://192.168.0.102:5173/",
    "http://192.168.0.102:5174/",
    "http://192.168.0.102:5175/",
    "*"],
  credentials: true,
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", corsOptions.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cors(corsOptions));
app.use(express.json());
// app.use("/", express.static("uploads"));
app.use("/api/v1/auth", AdminRoute);
app.use("/api/v1/auth",UserRoute);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("gogoshop server is running");
});
