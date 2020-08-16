const express = require("express");
require("./db/mongoose/mongoose");
const userRoutes = require("./routers/userRoutes");
const taskRoutes = require("./routers/taskRoutes");

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log("The service is up port 3000");
})