const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
//
const User = new Schema({
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
});

User.pre("save", async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
    } catch (error) {
        next(error);
    }
});

User.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

const user = mongoose.model("user", User);

module.exports = user;