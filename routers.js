const express = require("express");
const router = express.Router();

const keys = {
    email: "uzbekdev98@yahoo.com",
    password: "anaxtar777",
};

//Home route
router.get("/", (req, res) => {
    res.status(200).render("base", { title: "Application system" });
});
// Log in route
router.post("/login", (req, res) => {
    if (req.body.email == keys.email && req.body.password == keys.password) {
        res.status(200).render("loggedIn", { title: "Logged In !!!" });
    } else {
        res.status(200).render("_invalidPage", { title: "Ooops!!!" });
    }
});
// Log Out route
router.get("/loggedOut", (req, res) => {
    res.status(200).render("_loggedOut", { title: "Logged Out !!!" });
});

module.exports = router;