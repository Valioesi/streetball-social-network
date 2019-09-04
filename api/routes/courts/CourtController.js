/**
 * Controller to handle the routes to all activites handling courts
 */

const express = require('express');
const router = express.Router();
const Court = require('./Court.js');
const authMiddleware = require('./../authMiddleware.js');

//add authentication middleware
router.use(authMiddleware);

//create new court
router.post('/', (req, res) => {
    Court.create({
        name: req.body.name,
        city: req.body.city,
        address: req.body.address,
        baskets: req.body.baskets,
        players: []
    }, (err, court) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Error inserting court to db'});
        } else {
            res.status(201).send({ success: true, message: 'Court created successfully', court: court });
        }
    });
});

//get all courts
router.get('/', (req, res) => {
    Court.find({}, (err, courts) => {
        if(err){
            res.status(500).send({ success: false, message: 'Error getting courts' });
        }else{
            res.status(200).send({ success: true, message: 'Courts fetched successfully', courts: courts })
        }
    });
});

module.exports = router;