const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager", { useNewUrlParser: true });

const Task = mongoose.model("Task", {
    completed: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        trim: true,
        required: true
    }
});

var task = new Task({
    description: " Do something   "
});
task.save().then(result => console.log("Success: " + result))
    .catch(error => console.log("Error: " + error));

// var user = new User({
    // name: " Nhat Tran  ",
    // email: "abc@eblca.vn",
    // password: "fdsffdsfdspasswor"
// })

// user.save().then(result => console.log("Success: " + result))
    // .catch(error => console.log("Error: " + error));
