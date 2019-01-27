const router = require('express').Router();
const GamesModel = require('../models/Games');
const {configs} = require('../configs/configs');

// Separeted functions for modularity's sake
const createGame = (body, cb) => {
    GamesModel.create({
        _id: new Date().getTime(),
        played: false,
        playedDate: null,
        subscribers: body.subscribers || [],
        pairs: [],
        domain: body.domainId
    }, (error, _Game) => {
        if (error) {
            cb(500, { created: false, error });
        } else {
            cb(null, { created: true, _Game });
        }
    });
};

const findGameByDomainId = (domainId, cb) => {
    GamesModel.find({ domain: domainId }, (error, result) => {
        if (error || result.length < 1) {
            cb(500, { result, error });
        } else {
            cb(null, { result });
        }
    });
};

const playGame = (domainId, cb) => {
    GamesModel.findOneAndUpdate({ domain: domainId }, {played: true, playedDate: new Date()}, (error, result) => {
        if (!error || result.length > 0) {
            cb(null, result);
        } else {
            cb(error, result);
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

router.get('/find/:domainId', (req, res) => {
    if (req.params.domainId) {
        findGameByDomainId(req.params.domainId, (error, result) => {
            if (error) {
                res.status(error).json(result);
            } else {
                res.status(200).json(result);
            }
        });
    } else {
        res.status(400).json({ domainId: req.params.domainId });
    }
});

module.exports = {
    createGame,
    findGameByDomainId,
    playGame,
    router
};