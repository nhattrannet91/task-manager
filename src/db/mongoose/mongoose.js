const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager", { useNewUrlParser: true });

const Task = mongoose.model("Task", {
    completed: {
        type: Boolean
    },
    description: {
        type: String
    }
});

var task = new Task();
task.description = "Practicing NodeJS";
task.completed = false;
task.save().then(result => console.log("Success: " + result))
    .catch(error => console.log("Error: " + error));