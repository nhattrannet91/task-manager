const express = require("express")
const User = require("../db/models/user");
const router = new express.Router()

router.post("/users", async (req, res) => {
    var user = new User(req.body);
    try {
        const result = await user.save();
        res.status(201).send(result);
    } catch (error) {
        res.status("400").send(error);
    }
})

router.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send()
    }
})

router.get("/users/:id", async (req, res) => {
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

router.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["name", "email", "password"];
    const isValidUpdates = updates.every(update => allowUpdates.includes(update));
    if (!isValidUpdates) {
        return res.status(400).send();
    }

    try {
        var user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send({error});
    }
})

router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;