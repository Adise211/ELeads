import express from "express";
import usersRouter from "./users.route.js";
import leadsRouter from "./leads.route.js";

const app = express();

app.use("/users", usersRouter);
app.use("/leads", leadsRouter);
// app.use("/notes", notesRouter);
// app.use("/workspaces", workspacesRouter);

export default app;
