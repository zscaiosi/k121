const router = require('express').Router();
const GamesModel = require('../models/Games');
const {configs} = require('../configs/configs');
const {}

// Separeted functions for modularity's sake
const createGame = (body, cb) => {
    GamesModels.create({
        _id: new Date().getTime(),
        played: false,
        playedDate: null,
        subscribers: [],
        pairs: [],
        domain: body.domainName
    }, (error, _Game) => {
        if (error) {
            cb(500, { created: false, error });
        } else {
            cb(null, { created: true, _Game });
        }
    });
};
const findGameById = (_id, cb) => {
    GamesModels.find({ _id }, (error, result) => {
        if (error || result.length < 1) {
            cb(500, { result, error });
        } else {
            cb(null, { result });
        }
    });
};
// Routes
router.post('/create', (req, res) => {
    if (req.body) {
        createGame(req.body, (error, result) => {
            if (error) {
                res.status(error).json(result);
            } else {
                res.status(200, result);
            }
        });
    } else {
        res.status(400).json({ body });
    }
});

router.get('/find/:name', (req, res) => {
    if (req.params.name) {
        findGameByName(req.params.name, (error, result) => {
            if (error) {
                res.status(error).json(result);
            } else {
                res.status(200).json(result);
            }
        });
    } else {
        res.status(400).json({ name: req.params.name });
    }
});

module.exports = {
    createGame,
    findGameById,
    router
};