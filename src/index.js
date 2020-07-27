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

app.get("/users", (req, res) => {
    User.find({}).then(users => res.send(users))
        .catch(error => res.status(500).send());
})

app.get("/users/:id", (req, res) => {
    User.findById(req.params.id).then(user => {
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    })
    .catch(error => res.status(500).send(error));
})

app.post("/tasks", (req, res) => {
    var task = new Task(req.body);
    task.save().then(result => res.status(201).send(result))
        .catch(error => res.status("400").send(error));
})

app.get("/tasks", (req, res) => {
    Task.find({}).then(tasks => res.send(tasks))
        .catch(error => res.status(500).send());
})

app.get("/tasks/:id", (req, res) => {
    Task.findById(req.params.id).then(task => {
        if (!task) {
            console.log("Task not found");
            return res.status(404).send();
        }

        res.send(task);
    })
    .catch(error => res.status(500).send(error));
})

app.listen(port, () => {
    console.log("The service is up port 3000");
})