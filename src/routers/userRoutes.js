const express = require("express")
const User = require("../db/models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
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


router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["name", "email", "password"];
    const isValidUpdates = updates.every(update => allowUpdates.includes(update));
    if (!isValidUpdates) {
        return res.status(400).send();
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send({error});
    }
})

router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
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

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload an image"))
        }

        cb(null, true);
    }
});

router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    req.user.avatar = await sharp(req.file.buffer).resize(250, 250).png().toBuffer();
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
})

router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }

        res.set("Content-Type", "image/png");
        res.send(user.avatar);
    } catch (error) {
       res.status(404).send();
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