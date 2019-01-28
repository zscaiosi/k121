let assert = require('chai').assert;
let usersControllers = require('../src/controllers/usersController');
let domainsController = require('../src/controllers/domainsController');
let gamesController = require('../src/controllers/gamesController');

describe('Routes', function(){
    describe('Users Controllers', function(){
        it('Should create a user.', function(done){
            this.timeout(6000);

            usersControllers.createUser({ email: 'zscaio.si@gmail.com', password: '123456', name: 'Caio Saldanha', domains: ['amigo_secreto'] }, function(error, result){
                assert.isNull(error);
                done();
            });
        });
    });

    describe('Domains Controllers', function(){
        it('Should Create Domain', function(done){
            this.timeout(6000);

            domainsController.createDomain({ name: 'amigo_secreto', finishDate: new Date('2019-12-25') }, (error, result) => {
                assert.isNull(error);
                done();
            });
        });
    });

    describe('Games Controllers', function(){
        
        it('Shuld Create Game', function(done){
            this.timeout(10000);

            gamesController.createGame({ subscribers: ["1548617028320u", "1548636066335u", "1548618176432u", "1548636255048u"], domainId: 'amigo_secreto' }, (error, result) => {
                assert.isNull(error);
                done();
            });
        });
    });
});