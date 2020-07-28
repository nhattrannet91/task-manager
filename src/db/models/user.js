const mongoose = require("mongoose");
const validator = require("validator");

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

module.exports = User;