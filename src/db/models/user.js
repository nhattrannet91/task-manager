const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

userSchema.pre("save", async function (next) {
    const user = this;
     if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8);
     }
    return next();
})

userSchema.pre("remove", async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
})

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.tokens
    delete userObject.password
    return userObject;
}

userSchema.methods.generateToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id : user._id.toString()}, "thisisanexercise");
    user.tokens.push({ token });
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({email});
    if(!user){
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error("User not found");
    }

    return user;
}
const User = mongoose.model("User", userSchema);

module.exports = User;