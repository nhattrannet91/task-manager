const express = require("express")
const Task = require("../db/models/task");
const router = new express.Router()

router.post("/tasks", async (req, res) => {
    var task = new Task(req.body);
    try {
        const result = await task.save();
        res.status(201).send(result);
    } catch (error) {
        res.status("400").send(error)
    }
})

router.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (error) {
        res.status(500).send()
    }
})

router.get("/tasks/:id", async (req, res) => {
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

router.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["completed"];
    const isValidUpdates = updates.every(update => allowUpdates.includes(update));
    if (!isValidUpdates) {
        return res.status(400).send();
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(400).send("Task not found");
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send({error});
    }
})

router.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send({ error: "Task not found" });
        }

        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;