const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("./helpers/mongoose");
const { SchemaVal } = require("./helpers/joiValidation");
const { signAccessToken, refreshAccessToken } = require("./helpers/JWT_helper");
//Home route
router.get("/", async(req, res) => {
    res.render("_registerPage", { title: "Sing Up" });
});
//Register
router.post("/register", async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw createError.BadRequest();
        const result = await SchemaVal.validateAsync(req.body);
        const exists = await User.findOne({ email: result.email });
        if (exists)
            throw createError.Conflict(`${result.email} is already exists!`);
        const userPro = new User(result);
        const savedUser = await userPro.save();
        const accessToken = await signAccessToken(savedUser.id);
        const refreshToken = await refreshAccessToken(savedUser.id);
        console.log(accessToken, refreshToken);

        res.render("logging_in", {
            email: result.email,
            accessToken,
            refreshToken,
            title: "Log In",
        });
    } catch (error) {
        res.render("_invalidPage1", { error: error.message, title: "Error" });
        next(error);
    }
});
// Log in route
router.post("/login", async(req, res, next) => {
    try {
        const result = await SchemaVal.validateAsync(req.body);
        const user = await User.findOne({ email: result.email });
        if (!user) throw createError.NotFound("You are not registered!");
        const isMatch = await user.isValidPassword(result.password);
        if (!isMatch) throw createError.Unauthorized("Unauthorized:(");
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await refreshAccessToken(user.id);
        console.log(accessToken, refreshToken);
        res.render("loggedIn", {
            email: result.email,
            accessToken,
            refreshToken,
            title: "Success!!!",
        });
    } catch (error) {
        res.render("_invalidPage2", { error: error.message, title: "Error" });
        next(error);
    }
});
// Log Out route
router.get("/loggedOut", (req, res) => {
    // res.status(200).render("_loggedOut", { title: "Logged Out !!!" });
    res.redirect("/", { title: "Logged Out !!!" });
});

module.exports = router;