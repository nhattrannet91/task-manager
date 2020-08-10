const express = require("express")
const Task = require("../db/models/task");
const auth = require("../middleware/auth");
const router = new express.Router()

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({ ...req.body, owner: req.user._id });
    try {
        const result = await task.save();
        res.status(201).send(result);
    } catch (error) {
        res.status("400").send(error)
    }
})

router.get("/tasks", auth, async (req, res) => {
    try {
        await req.user.populate("tasks").execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send()
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