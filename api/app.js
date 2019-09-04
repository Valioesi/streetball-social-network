const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config.js');
const UserController = require('./routes/users/UserController.js');
const SessionController = require('./routes/sessions/SessionController.js');
const CourtController = require('./routes/courts/CourtController.js');


//define middleware
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//define routes mapping the routes to the correspondent controllers
app.use('/users', UserController);
app.use('/sessions', SessionController);
app.use('/courts', CourtController);

//Connect to mongoose
mongoose.connect(config.database);
const db = mongoose.connection;


app.listen(3000, () => {
    console.log('App listening on port 3000');
});