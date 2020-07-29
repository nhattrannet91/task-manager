const express = require("express");
require("./db/mongoose/mongoose");
const User = require("./db/models/user");
const Task = require("./db/models/task");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.post("/users", async (req, res) => {
    var user = new User(req.body);
    try {
        const result = await user.save();
        res.status(201).send(result);
    } catch (error) {
        res.status("400").send(error);
    }
})

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send()
    }
})

app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["name", "email", "password"];
    const isValidUpdates = updates.every(update => allowUpdates.includes(update));
    if (!isValidUpdates) {
        return res.status(400).send();
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.send(user);
    } catch (error) {
        res.status(400).send();
    }
})

app.post("/tasks", async (req, res) => {
    var task = new Task(req.body);
    try {
        const result = await task.save();
        res.status(201).send(result);
    } catch (error) {
        res.status("400").send(error)
    }
})

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (error) {
        res.status(500).send()
    }
})

app.get("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            console.log("Task not found");
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(500).send(error)
    }
})

app.listen(port, () => {
    console.log("The service is up port 3000");
})