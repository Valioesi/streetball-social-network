/**
 * Controller to handle the routes to all activites handling sessions
 */

const express = require('express');
const router = express.Router();
const Session = require('./Session.js');
const authMiddleware = require('./../authMiddleware.js');

//add authentication middleware
router.use(authMiddleware); 

//create new session
router.post('/', (req, res) => {
    console.log(req.body);
    //get the user id from the decoded jw token: _doc contains info about user
    const userId = req.decoded._doc._id;
    Session.create({
        owner: userId,
        time: req.body.time || Date.now(),
        court: req.body.court,
        players: [userId]
    }, (err, session) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Error inserting Session to db'});
        } else {
            res.status(201).send({ success: true, message: 'Session created successfully', session: session });
        }
    });
});


//participate in already created session
router.put('/:id', (req, res) => {
    //get the user id from the decoded jw token: _doc contains info about user
    const userId = req.decoded._doc._id;
    Session.findById(req.params.id, (err, session) => {
        if (err) {
            res.status(500).send('Error finding session');
        } else {
            session.players.push(userId);
            session.save((err, updatedSession) => {
                if (err) {
                    res.status(500).send('Error updating session');
                } else {
                    res.status(200).send(updatedSession);
                }
            });
        }
    });

});

//get all sessions
router.get('/', (req, res) => {
    Session.find({}, (err, sessions) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Error getting Sessions' });
        } else {
            res.status(200).send({ success: true, message: 'Sessions retrieved successfully', sessions: sessions });
        }
    })
});

module.exports = router;