const express = require("express");
require("./db/mongoose/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.post("/users", (req, res) => {
    var user = new User(req.body);
    user.save().then(result => res.status(201).send(result))
        .catch(error => res.status("400").send(error));
})

app.post("/tasks", (req, res) => {
    var task = new Task(req.body);
    task.save().then(result => res.status(201).send(result))
        .catch(error => res.status("400").send(error));
})

app.listen(port, () => {
    console.log("The service is up port 3000");
})