const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
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

userSchema.pre("save", async function (next) {
    const user = this;
     if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8);
     }
    return next();
})
const User = mongoose.model("User", userSchema);

module.exports = User;