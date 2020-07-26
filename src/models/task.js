
const mongoose = require("mongoose");

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

module.exports = Task;