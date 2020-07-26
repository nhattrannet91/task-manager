const express = require("express");
const User = require("./models/user");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.post("/users", (req, res) => {
    var user = new User(req.body);
    user.save().then(result => res.send(result))
        .catch(error => res.status("400").send(error));
})

app.listen(port, () => {
    console.log("The service is up port 3000");
})