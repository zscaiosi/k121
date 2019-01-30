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

async function asyncPlayGame(domainId){
    // First checks if matches all users, then make pairs
    findGameByDomainId(domainId, async (error, games) => {
        let emailSent = [];
        let updated = null;
        
        if (error || games.result[0].length < 1) {
            cb(500, {error, games});
        } else {
            if (games && games.result[0] && games.result[0].subscribers && games.result[0].subscribers.length % 2 === 0) {

                let pairs = [];
                
                games.result[0].subscribers.forEach((element, index, original) => {

                    if (index % 2 == 0 || index === 0) {
                        pairs = [...pairs, original.slice(index, index+2)];
                    }

                });
                console.log("formed pairs", pairs);
                sendEmails(pairs);
                // Now updates the Game
                updated = await GamesModel.findOneAndUpdate({ domain: domainId }, {played: true, pairs, playedDate: new Date()});
                console.log("UPDATED GAME", updated);
                
                // Returns the results
                return {emailSent, updated, error, games};
            } else {
                return {emailSent, updated, error, games};
            }

        }
    });
};

const sendEmails = (pairs) => {

    for(let i = 0; i < pairs.length; i++){
        for(let j = 0; j < pairs[i].length; j ++){
            let sendTo = '';
            if ( j === 0 ) {
                sendTo = pairs[i][j+1];
            } else {
                sendTo = pairs[i][j-1];
            }

            console.log(i, j, "Pair = ", pairs[i], "De para", pairs[i][j], sendTo)
            mailer(sendTo, "Seu amigo secreto está definido!", "O seu amigo secreto é: " + pairs[i][j], (err, result) => {
                // Does not stop process if fails, usually would log rejected e-mails
                console.log("Loggin: ", pairs[i][j], "\n error: \n", {err, result});                   
            });
        }
    }

};

// Routes
router.post('/create', (req, res) => {
    if (req.body) {
        createGame(req.body, (error, result) => {
            if (error) {
                res.status(error || 500).json({error, result});
            } else {
                res.status(200).json({ error, result });
            }
        });
    } else {
        res.status(400).json({ body });
    }
});

router.put('/play', async (req, res) => {
    try{
        let result = await asyncPlayGame(req.body.domain);
        res.status(200).json({ result });
    }catch(exception){
        res.status(500).json({ error: exception });
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
    asyncPlayGame,
    sendEmails,
    games: router
};