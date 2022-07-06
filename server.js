const path = require("path");
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const routersFile = require("./routers");
const morgan = require("morgan");
const createError = require("http-errors");
const mongoose = require("mongoose");
require("dotenv").config();
//
const port = process.env.PORT || 7000;
//
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
    })
    .then((con) => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err.message);
    });
//
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
//
app.use(morgan("dev"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "template")));
// Routing:
app.use("/", routersFile);
//Error handler:
app.use(async(req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({ status: err.status || 500, message: err.message });
    console.log(err);
});
//
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});