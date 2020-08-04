const express = require("express")
const User = require("../db/models/user");
const auth = require("../middleware/auth");
const router = new express.Router()

router.post("/users", async (req, res) => {
    let user = new User(req.body);
    try {
        user = await user.save();
        const token = await user.generateToken();
        res.status(201).send({user, token});
    } catch (error) {
        res.status("400").send(error);
    }
})

router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
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
        let user = await User.findById(req.params.id);
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

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        const token = await user.generateToken()
        res.send({user, token});
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(x => x.token !== req.token);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post("/users/logoutall", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;