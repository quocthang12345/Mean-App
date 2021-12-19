const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signUpUser = (req, res , next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(response => {
                    console.log("success")
                    res.status(200).json({
                        message:"Register Success!",
                        data: response
                    })
                })
                .catch(error => {
                    console.log("error")
                    res.status(400).json({
                        message:"Register Failed!",
                        error: error
                    })
                })
        })
        .catch(error => {
            res.status(400).json({
                message:"Register Failed!",
                error: error
            })
        })
}

exports.loginUser = (req, res, next) => {
    let fetchUser;
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message: "Auth failed!"
                })
            }
            fetchUser = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(response => {
            if(!response){
                return res.status(401).json({
                    message: "Auth failed!"
                })
            }
            const token = jwt.sign(
                {email: fetchUser.email, userId: fetchUser._id},
                process.env.JWT_KEY, 
                {
                    expiresIn: "1h"
                }
            );

            res.status(200).json({
                message: "Auth success!",
                token: token,
                expireTime: 3600,
                userId: fetchUser._id
            })

        })
        .catch(error => {
            res.status(401).json({
                message: "Invalid Authentication crenditials!",
                error
            })
        })
}