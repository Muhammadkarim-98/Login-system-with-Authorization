const path = require("path");
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const routersFile = require("./routers");
const port = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "template")));

app.use(
    session({
        secret: uuidv4(), //xbjwpiuhxbewknxiwehbxnxewlkx
        resave: false,
        saveUninitialized: true,
    })
);

// Routing
app.use("/", routersFile);

app.listen(port, () => {
    console.log("listening on port 3000!");
});