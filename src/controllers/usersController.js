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
                let token = null;
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
            cb(500, { created: false, error });
    });
};

const fetchByDomain = (domainId, cb) => {
    UsersModel.find({ domains: {
        "$in": domainId
    } }, (error, result) => {
        if (!error || result.length > 0) {
            cb(null, result);
        } else {
            cb(error || 500, result);
        }
    });
};
// Will be called by async function
const findById = (_id, cb) => {
    UsersModel.findById(_id, (error, result) => {
        if (error) {
            cb(error, result);
        } else {
            cb(result, result);
        }
    });
};

// ROUTES
router.post('/register', (req, res) => {
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

router.put('/update', (req, res) => {
    if (!req.body && !req.body._id) {
        res.status(400).json({ body: req.body });
    } else {
        // Creating salt
        const salt = bcrypt.genSaltSync(10);

        UsersModel.findOneAndUpdate({ _id: req.body._id }, {name: req.body.name, email: req.body.email, password: bcrypt.hashSync(req.body.password, salt)}, (error, result) => {
            if (error) {
                res.status(500).json({ error, result });
            } else {
                res.status(200).json({ updated: true, result });
            }
        });
    }
});

router.delete('/remove/:userId', (req, res) => {
    if (!req.params.userId) {
        res.status(400).json({ params: req.params });
    } else {
        UsersModel.findOneAndRemove({ _id: req.params.userId }, (error, result) => {
            if (error) {
                res.status(500).json({ error, result });
            } else {
                res.status(200).json({ updated: true, result });
            }
        });
    }    
});

module.exports = {
    findByEmailAndPassword,
    createUser,
    fetchByDomain,
    findById,
    users: router
}