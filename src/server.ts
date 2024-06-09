import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import morgan from "morgan";
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(
  cors({
    origin: ["http://localhost:5173", "*"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1/user", require("./routes/user.route"));
app.use("/api/v1/project", require("./routes/project.route"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
