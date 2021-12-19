const express = require("express");
const path = require('path')
const parser = require("body-parser");
const mongoose = require('mongoose');
const PostRouter = require("./posts/posts-api")
const UserRouter = require("./user/user-api")

const app = new express();
// kJhLV7nzrDjdWQV password mongodb cloud
mongoose.connect(`mongodb+srv://quocthang123:${process.env.MONGO_PWD}@angular-app-cluster.a64kh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        .then(() => {
            console.log("Connected Database Success!")
        })
        .catch(() => {
            console.log("Connection Failed")
        })

app.use(parser.json());
app.use(parser.urlencoded({ extended: false}));
app.use("/images", express.static(path.join("images")))


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, X-Requested-With, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
    next();
})

app.use(PostRouter);
app.use(UserRouter);


module.exports = app