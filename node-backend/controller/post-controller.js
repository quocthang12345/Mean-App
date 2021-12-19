const Post = require('../models/post')
const mongoose = require('mongoose');

exports.fetchListPost = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.currentpage;
    const postQuery = Post.find();
    let fetchDocs;
    if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery
        .then(docs => {
            fetchDocs = docs;
            return Post.count();
        })
        .then(count => {
            res.json({
                message:"success",
                data: fetchDocs,
                totalPost: count
            })
        })
        .catch(error => {
            res.status(401).json({
                message:"Not Authorize!"
            })
        });
    // res.send(posts);
}

exports.fetchOnePost = (req, res, next) => {
    const objId = mongoose.Types.ObjectId(req.params.id);
    Post.findById(objId).then(doc => {
        res.status(200).json(doc)
    })
    .catch(error => {
        res.status(401).json({
            message:"Not Authorize!"
        })
    })
}

exports.addPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        name: req.body.name,
        description: req.body.description,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save();
    res.json({
        message:"Add Success!"
    })
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const data = new Post({
        _id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    const objId = mongoose.Types.ObjectId(data.id);
    Post.updateOne({_id: objId,creator: req.userData.userId},data).then(result => {
        if(result.matchedCount > 0){
            res.status(200).json({
                message: "Update Successfully!"
            })
        }else{
            res.status(401).json({
                message: "Invalid data model!"
            })
        }
    })
    .catch(error => {
        res.status(401).json({
            message:"Not Authorize!"
        })
    })
}

exports.deletePost = (req, res, next) => {
    const objId = mongoose.Types.ObjectId(req.params.id);
    Post.deleteOne({ _id: objId, creator: req.userData.userId }).then(result => {
        if(result.deletedCount > 0){
            res.status(200).json({
                message:"Deleted Success!"
            })
        }else{
            res.status(401).json({
                message:"Deleted Failed!"
            })
        }
    })
    .catch(error => {
        res.status(401).json({
            message:"Not Authorize!"
        })
    })
}