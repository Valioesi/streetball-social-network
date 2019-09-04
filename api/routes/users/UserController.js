/**
 * Controller to handle the routes to all activites handling stuff with the users
 */
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../../config.js');
//import User model
const User = require('./User.js');
const authMiddleware = require('./../authMiddleware.js');


//create new user
router.post('/register', (req, res) => {
    //check if email is already registered
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Error looking up user'});
        } else {
            console.log(user);
            if (user) {
                res.status(200).send({ success: false, message: 'User is already registered'});
            } else {
                //hash password
                console.log(req.body);
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).send({ success: false, message: 'Error hashing password'});
                    } else {
                        User.create({
                            username: req.body.username,
                            email: req.body.email,
                            password: hash
                        }, (err, user) => {
                            if (err) {
                                res.status(500).send({ success: false, message: 'Error inserting user into database'});
                            } else {
                                res.status(201).send({ success: true, message: 'You were registered successfully', user: user});
                            }
                        });
                    }
                });
            }
        }
    });
});

//login: if user is authenticated he receives an auth token and also his id
router.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Error finding user'});
        } else if (!user) {
            res.status(200).send({ success: false, message: 'No User found'});
        } else {
            //user was found -> check password
            bcrypt.compare(req.body.password, user.password, (err, compareRes) => {
                if (compareRes) { //password correct
                    //create auth token
                    const token = jwt.sign(user, config.secret, {
                        expiresIn: '24h'
                    });
                    //send token and id of user as response
                    res.status(200).send({ success: true, message: 'You were logged in successfully', token: token });
                } else {
                    res.status(200).send({ success: false, message: 'Authentication failed. Password incorrect'});
                }
            });

        }
    });
});



//search for user by username
router.get('/search/:username', authMiddleware, (req, res) => {
    console.log("Username: "+ req.params.username);
    //get the user id from the decoded jw token: _doc contains info about user
    const userId = req.decoded._doc._id;
    //lean() is used so that a js object is returned, so that we later are able to add properties to it
    User.find({
        username: { $regex : req.params.username },
        _id: { $ne : userId }  //we do not want the logged in user to be found of course
    }, { password: 0 }).lean().exec((err, users) => {       //don't get password field, because we do not want to send it to client
        if(err) {
            res.status(500).send({ success: false, message: 'Error searching for users' });
        }else{
            //loop through users and check for every user if he is a friend
            users.forEach((user) => {
                //check if the logged in user is a friend of this user
                if(user.friendRequests.indexOf(req.decoded._doc._id) !== -1){
                    //in this case we set the isFriend field to true
                    user.friendStatus = 'requested';
                }else if(user.friends.indexOf(req.decoded._doc._id) !== -1){
                    user.friendStatus = 'friend';
                }else{
                    user.friendStatus = 'notFriend';
                }
            });
            console.log(users);
            res.status(200).send({ success: true, message: 'Searching for user successfull', users: users });
        }
    });
})

//get friends (and friend requests) of logged in user
router.get('/friends', authMiddleware, (req, res) => {
    //get the user id from the decoded jw token: _doc contains info about user
    const userId = req.decoded._doc._id;
    //find the logged in user
    User.findById(userId, (err, user) => {
        console.log('user: ', user);
        //find all users which are friends
        User.find({ _id: { $in: user.friends }}, (err, friends) => {
            if (err) {
                res.status(500).send({ success: false, message: 'Error finding friends'});
            } else {
                console.log('Friends: ', friends);
                //now find all users which friend requests
                console.log('friend Requests ids: ', user.friendRequests);
                User.find({ _id: { $in: user.friendRequests }}, (err, friendRequests) => {
                    if (err) {
                    res.status(500).send({ success: false, message: 'Error finding friend requests'});
                    } else {
                        console.log('Friend requests: ', friendRequests);
                        res.status(200).send({ 
                            success: true, 
                            message: 'Friends and friend requests retrieved successfully', 
                            friends: friends, 
                            friendRequests: friendRequests
                        });
                    }
                });
            }
        });
    });
});

//add friend
router.post('/friends', authMiddleware, (req, res) => {
    //get the user id from the decoded jw token: _doc contains info about user
    const userId = req.decoded._doc._id;
    //find the logged in user and add the id of the friend we want to add
    User.findById(userId, (err, user) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Error finding logged in User'});
        } else {
            user.notYetFriends.push(req.body.friendId);
            user.save((err, updatedUser) => {
                if (err) {
                    res.status(500).send({ success: false, message: 'Error updating logged in user'});
                } else {
                    //now we find the user, we want to add as an friend, and add the logged in user's id to friend requests
                    User.findById(req.body.friendId, (err, friend) => {
                        if (err) {
                            res.status(500).send({ success: false, message: 'Error finding friend'});
                        } else {
                            friend.friendRequests.push(userId);
                            friend.save((err, updatedFriend) => {
                                if (err) {
                                    res.status(500).send({ success: false, message: 'Error updating friend'});
                                } else {
                                    res.status(200).send({ success: true, message: 'Updated logged in User and updated friend'});
                                }
                            })
                        }
                    })
                }
            });
        }
    });
});

//accept friend request
router.put('/friends', authMiddleware, (req, res) => {
    //get the user id from the decoded jw token: _doc contains info about user
    const userId = req.decoded._doc._id;
    const friendId = req.body.friendId;
    //find the logged in user
    User.findById(userId, (err, user) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Error finding logged in User'});
        } else {
            //remove the friend id from the friendRequests array
            let index = user.friendRequests.indexOf(friendId);
            if (index !== -1) {
                user.friendRequests.splice(index, 1);
                //now we add the friend id to friends array
                user.friends.push(friendId);
                user.save((err, updatedUser) => {
                    if (err) {
                        res.status(500).send({ success: false, message: 'Error updating logged in user'});
                    } else {
                        //now we need to update the friend record
                        User.findById(friendId, (err, friend) => {
                            if (err) {
                                res.status(500).send({ success: false, message: 'Error finding friend'});
                            } else {
                                //remove the user id from the notYetFriends array...
                                index = friend.notYetFriends.indexOf(userId);
                                if (index !== -1) {
                                    friend.notYetFriends.splice(index, 1);
                                    //...and add the user Id to friends array
                                    friend.friends.push(userId);
                                    friend.save((err, updatedFriend) => {
                                        if (err) {
                                            res.status(500).send({ success: false, message: 'Error updating friend'});
                                        } else {
                                            res.status(200).send({ success: true, message: 'Updated user and friend. Both ids are now only in the friends array'});
                                        }
                                    });
                                } else {
                                    res.status(500).send({ success: false, message: 'User somehow not in notYetFriends array of friend'});
                                }
                            }
                        })
                    }
                });
            } else {
                res.status(500).send({ success: false, message: 'Friend somehow not in friend requests'});
            }
        }
    })
});


//get all users
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Error getting users'});
        } else {
            res.status(200).send({ success: true, message: 'Users are fetched successfully', users: users});
        }
    })
});

//endpoint to check if user is already logged in (e.g. use on loading of app)
//it simply uses the auth middleware, if it passes we send back success
router.post('/authenticate', authMiddleware, (req, res) => {
    res.status(200).send({ success: true, message: 'User is authenticated'});
});

module.exports = router;