const router = require('express').Router();
const DomainsModels = require('../models/Domains');

// Separeted functions for modularity's sake
const createDomain = (body, cb) => {
    DomainsModels.create({
        _id: body.name,
        domainName: body.name,
        createDate: new Date(),
        finishDate: body.finishDate,
        played: false
    }, (error, _Domain) => {
        if (error) {
            cb(500, { created: false, error });
        } else {
            cb(null, { created: true, _Domain });
        }
    });
};
const findDomainByName = (domainName, cb) => {
    DomainsModels.find({ domainName }, (error, result) => {
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
        createDomain(req.body, (error, result) => {
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
        findDomainByName(req.params.name, (error, result) => {
            if (error || result.length < 1) {
                res.status(error || 500).json(result);
            } else {
                res.status(200).json(result);
            }
        });
    } else {
        res.status(400).json({ name: req.params.name });
    }
});

module.exports = {
    createDomain,
    findDomainByName,
    domains: router
};