const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.post("/users", (req, res) => {
    res.send("Testing")
})

app.listen(port, () => {
    console.log("The service is up port 3000");
})