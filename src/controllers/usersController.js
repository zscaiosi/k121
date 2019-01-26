const router = require('express').Router();
const UsersModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {configs} = require('../configs/configs');

// Functions


// ROUTES
router.post('/register', (req, res) => {
    const salt = bcrypt.genSaltSync(10);

    if (!req.body.email || !req.body.password || !req.body.name) {
        res.status(400).json({ created: false, error: 'bad JSON' });
    } else {
        UsersModel.create({
            _id: String(Date.now()) + "u",
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            createDate: new Date(),
            role: 10
        }, (error, _User) => {
            if (!error)
                res.status(200).json({ created: true });
            else
                res.status(500).json({ error });
        });
    }
    
});

router.post('/login', (req, res) => {
    
    if (req.body === null || req.body === undefined) {
        console.log(req.body)
        res.status(400).json({ body: req.body });
    }
    
    if (req.body.email && req.body.password) {
        UsersModel.find({ email: req.body.email }, (error, result) => {
            
            if (!error && result[0]) {
                // Checks login credentials
                if (result && bcrypt.compareSync(req.body.password, result[0].password)) {
                    // Generates token
                    const token = jwt.sign({ email: result[0].email }, configs().secret, { expiresIn: 360000});
                    res.status(200).json({authenticated: true, token});
                } else {
                    res.status(401).json({ authenticated: false, token: null, found: result.length > 0 });
                }
            } else {
                res.status(500).json({ error });
            }

        });
    } else {
        res.status(400).json(req.body);
    }
    
});


module.exports = {
    getUser: (email, next) => {
        if (email) {
            UsersModel.find({ email }, (error, result) => {
                if (error)
                    next(error, null);
                
                    next(null, result);
            });
        } else {
            next('no email', null);
        }
    },
    users: router
}