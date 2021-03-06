const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {users} = require('../controllers/usersController');
const {domains} = require('../controllers/domainsController');
const {games} = require('../controllers/gamesController');
const jwt = require('jsonwebtoken');
const {configs} = require('../configs/configs');
const UsersModel = require('../models/Users');

const app = () => {
    const expressApp = express();
    expressApp.use(cors());
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({ extended: false }));

    expressApp.all('/*', (req, res, next) => {
        // Login should not be authorized yet
        if (req.path === '/users/login') {
            next();
        } else {
            try {
                // Checks Authorization header 
                const claims = jwt.verify(req.headers.authorization, configs().secret);
                if (!claims || !claims.email) {
                    res.status(401).send(claims);
                } else {
    
                    UsersModel.find({ email: claims.email }, (error, User) => {
                        if (error)
                            res.status(401).send("bad auth - " + JSON.stringify(error) + JSON.stringify(claims));
                        else
                            req.locals = {claims, current_user: User};
                            next();
                    });
                }
            }catch(exception){
                res.status(401).send("bad auth" + JSON.stringify(exception));
            }
        }
    });

    expressApp.use('/users', users);
    expressApp.use('/domains', domains);
    expressApp.use('/games', games);

    return expressApp;
};

module.exports = app;