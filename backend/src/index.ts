import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/test", async (req, res) => {
  res.json({ message: "hello world!" });
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
