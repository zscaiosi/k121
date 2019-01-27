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
                const token = null;
                if (result[0].role !== 1) {
                    token = null;
                } else {
                    token = jwt.sign({ email: result[0].email }, configs().secret, { expiresIn: 10000000000});
                }

                cb(null, { authenticated: token !== null, token, User: result[0] });
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
    console.log(body, salt)
    // Creating User
    UsersModel.create({
        _id: String(new Date().getTime()) + "u",
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, salt),
        createDate: new Date(),
        role: body.role || 1,
        domains: body.domains
    }, (error, _User) => {
        if (!error)
            cb(null, { created: true });
        else
            cb(500, { created: false });
    });
};

const fetchByDomain = (domainId, cb) => {
    UsersModel.find({ domains: {
        "$in": domainId
    } }, (error, result) => {
        console.log(error, result)
        if (!error || result.length > 0) {
            cb(null, result);
        } else {
            cb(error || 500, result);
        }
    });
};

// ROUTES
router.post('/register', (req, res) => {
console.log(req.body)
    if (!req.body.email || !req.body.password || !req.body.name) {
        res.status(400).json({ created: false, error: 'bad JSON' });
    } else {
        createUser(req.body, (error, result) => {
            
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
                res.status(200).json(result);
            }
        });
    } else {
        res.status(400).json(req.body);
    }
    
});

router.get('/findByDomain/:domainId', (req, res) => {
    if (!req.params.domainId) {
        res.status(400).json({ domainId: null });
    } else {
        fetchByDomain(req.params.domainId, (error, result) => {
            if (error || result.length < 1) {
                res.status(error || 500).json(result);
            } else {
                res.status(200).json({ result });
            }
        });
    }
});

module.exports = {
    findByEmailAndPassword,
    createUser,
    fetchByDomain,
    users: router
}