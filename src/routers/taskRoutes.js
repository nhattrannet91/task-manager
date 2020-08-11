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

// GET /tasks?completed=true
// GET /tasks?limit=1
// GET /tasks?skip=1
// GET /tasks?sort=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
    try {
        const match = {};
        const sort = {};
        if (req.query.completed) {
            match.completed = req.query.completed === "true";
        }

        if(req.query.sort){
            const parts = req.query.sort.split(":");
            sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
        }

        await req.user.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        console.log(error);
        res.status(500).send()
    }
})

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["completed"];
    const isValidUpdates = updates.every(update => allowUpdates.includes(update));
    if (!isValidUpdates) {
        return res.status(400).send();
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(400).send("Task not found");
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send({ error });
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.deleteOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send({ error: "Task not found" });
        }

        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;