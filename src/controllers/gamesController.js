const router = require('express').Router();
const GamesModel = require('../models/Games');
const {findById} = require('./usersController');
const mailer = require('../models/Mailer');

// Separeted functions for modularity's sake
const createGame = (body, cb) => {
    GamesModel.create({
        _id: new Date().getTime(),
        played: false,
        playedDate: null,
        subscribers: body.subscribers || [],
        pairs: [],
        domain: body.domain
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
    findGameByDomainId(domainId, (error, games) => {
        
        if (error || games.result[0].length < 1) {
            cb(500, {error, msg: 'findGameByDomainId', games});
        } else {
            if (games && games.result[0] && games.result[0].subscribers && games.result[0].subscribers.length % 2 === 0) {

                let pairs = [];
                
                games.result[0].subscribers.forEach((element, index, original) => {

                    if (index % 2 == 0 || index === 0) {
                        pairs = [...pairs, original.slice(index, index+2)];
                    }

                });
                // Sends email for each pair
                pairs.map( (pair, index) => {

                    asyncSendEmails(pair).then( (res) => {

                    }).catch( (err) => {
                        console.log("ERRRORRR");
                    });
                    
                });
                
                // Now updates the Game
                GamesModel.findOneAndUpdate({ domain: domainId }, {played: true, pairs, playedDate: new Date()}, (error, games) => {
                    if (!error || games.length > 0) {
                        cb(null, games);
                    } else {
                        cb(error, {error, msg: 'findOneAndUpdate', games});
                    }
                });
            } else {
                cb(400, { games, error: 'nâo é par!' });
            }

        }
    });
};

async function asyncSendEmails(pair){
    // Gets both Users
    let recipient1 = await findById(pair[0]);
    let recipient2 = await findById(pair[1]);
    console.log("RECIPIENTS: ", recipient1, recipient2);
    // Sends e-mail
    let mailResult1 = await mailer(recipient1.email, "Seu amigo secreto está definido!", "O seu amigo secreto é: " + recipient2.name);
    let mailResult2 = await mailer(recipient2.email, "Seu amigo secreto está definido!", "O seu amigo secreto é: " + recipient1.name);
    console.log("MAIL: ", mailResult1, mailResult2);

    return mailResult1 && mailResult2;
}

// Routes
router.post('/create', (req, res) => {
    if (req.body) {
        createGame(req.body, (error, result) => {
            if (error) {
                res.status(error).json({error, msg: 'createGame', result});
            } else {
                playGame(req.body.domain, (err, result) => {
                    if (err) {
                        res.status(500).json({error, msg: 'playGame', result});
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
    asyncSendEmails,
    games: router
};