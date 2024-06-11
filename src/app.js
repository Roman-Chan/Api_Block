import express from "express";
import cors from "cors";
import morgan from "morgan";
import login  from "./routes/login.routes.js";
import publication from "./routes/publication.routes.js";
import comment from "./routes/comment.routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


app.use("/login", login);
app.use("/publication", publication);
app.use("/comment", comment);

app.use((req, res) => {
    res.status(404).json("Ruta no encontrada");
});

export default app;
