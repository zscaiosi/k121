const router = require('express').Router();
const UsersModel = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {configs} = require('../configs/configs');

// Separeted functions for modularity's sake
const findByEmailAndPassword = (body, cb) => {
    UsersModel.find({ email: body.email }, (error, result) => {
            
        if (!error && result[0]) {
            // Checks login credentials
            if (result && bcrypt.compareSync(body.password, result[0].password)) {
                // Generates token for authorization
                const token = jwt.sign({ email: result[0].email }, configs().secret, { expiresIn: 10000000000});
                cb(null, { authenticated: true, token });
            } else {
                cb(401, { authenticated: false, token: null });
            }
        } else {
            cb(500, { authenticated: false, token: null });
        }

    });
};

const createUser = (body, cb) => {
    // Creating salt
    const salt = bcrypt.genSaltSync(10);
    // Creating User
    UsersModel.create({
        _id: String(Date.now()) + "u",
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt),
        createDate: new Date(),
        role: 1,
        domains: body.domains
    }, (error, _User) => {
        if (!error)
            cb(null, { created: true });
        else
            cb(500, { created: false });
    });
};

// ROUTES
router.post('/register', (req, res) => {

    if (!req.body.email || !req.body.password || !req.body.name) {
        res.status(400).json({ created: false, error: 'bad JSON' });
    } else {
        createUser({ body: req.body }, (error, result) => {
            
            if (error) {
                res.status(error).json(result);
            } else {
                res.status(200).json(result);
            }

        });
    }
    
});

router.post('/login', (req, res) => {
    
    if (req.body === null || req.body === undefined) {
        console.log(req.body)
        res.status(400).json({ body: req.body });
    }
    
    if (req.body.email && req.body.password) {
        // Finds user by e-mail
        findByEmailAndPassword({email: req.body.email, password: req.body.password}, (error, result) => {
            // Callback
            if (error) {
                res.status(error).json(result);
            } else {
                res.status(error).json(result);
            }
        });
    } else {
        res.status(400).json(req.body);
    }
    
});


module.exports = {
    findByEmailAndPassword,
    createUser,
    users: router
}