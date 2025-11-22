import express from "express";
import helmet from "helmet";
import empRoute from "./routes/empRoute.js";
import loginRoute from "./routes/loginRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authMiddleware } from "./middleware/AuthMiddleware.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/login", loginRoute);
app.use("/api/GetEmpStatus", authMiddleware, empRoute);

app.use(errorHandler);

export default app;
