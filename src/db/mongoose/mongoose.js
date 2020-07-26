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

const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowerCase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("The input value is not a valid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.includes("password")) {
                throw new Error(`The password contains \"password\"`)
            }
        }
    }
})

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
