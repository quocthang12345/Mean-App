const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const PostController = require('../controller/post-controller')
const ExtractFile = require('../middleware/upload-file')


router.get("/posts", PostController.fetchListPost)

router.get("/posts/:id", PostController.fetchOnePost)

router.post("/addPost", checkAuth, ExtractFile, PostController.addPost)

router.put("/updatePost",checkAuth, ExtractFile, PostController.updatePost)

router.delete("/deletePost/:id",checkAuth, PostController.deletePost)


module.exports = router;

