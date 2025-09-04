import express from "express";
import usersRouter from "./users.route.js";
import leadsRouter from "./leads.route.js";
import workspaceRouter from "./workspace.route.js";
import billingsRouter from "./billings.route.js";

const app = express();

app.use("/users", usersRouter);
app.use("/leads", leadsRouter);
app.use("/workspace", workspaceRouter);
app.use("/billings", billingsRouter);

export default app;
