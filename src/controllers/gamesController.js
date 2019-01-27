const router = require('express').Router();
const GamesModel = require('../models/Games');

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

        if (error || !result || result.length < 1) {
            cb(500, { result, error });
        } else {
            cb(null, { result });
        }
    });
};

const playGame = (domainId, cb) => {
    // First checks if matches all users, then make pairs
    findGameByDomainId(domainId, (error, result) => {
        
        if (error || result.result.length < 1) {
            cb(500, {result, error});
        } else {
            if (result && result.result && result.result.subscribers && result.result.subscribers.length % 2 === 0) {

                let pairs = [];
                
                result.result.subscribers.forEach((element, index, original) => {

                    if (index % 2 == 0 || index === 0) {
                        pairs = [...pairs, original.slice(index, index+2)];
                    }

                });
                
                // Now updates the Game
                GamesModel.findOneAndUpdate({ domain: domainId }, {played: true, pairs, playedDate: new Date()}, (error, result) => {
                    if (!error || result.length > 0) {
                        cb(null, result);
                    } else {
                        cb(error, result);
                    }
                });
            } else {
                cb(400, { result, error: 'nâo é par!' });
            }

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
                playGame(req.body.domain, (err, result) => {
                    if (err) {
                        res.status(500).json(result);
                    } else {
                        res.status(200).json(result);
                    }
                });
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
    games: router
};