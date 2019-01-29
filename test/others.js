let assert = require('chai').assert;
let usersControllers = require('../src/controllers/usersController');
let domainsController = require('../src/controllers/domainsController');
let gamesController = require('../src/controllers/gamesController');

describe('Routes', function(){
    describe('Users Controllers', function(){

        it('Should find the user.', function(done){
            this.timeout(6000);

            usersControllers.findByEmailAndPassword({ email: 'zscaio.si@gmail.com', password: '123456' }, function(error, result){
                assert.isNull(error);
                assert.isString(result.token);
                done();
            });
        });
        it('Should fetch users from domain.', function(done){
            this.timeout(6000);

            usersControllers.fetchByDomain('amigo', function(error, result){
                assert.isNull(error);
                done();
            });
        });
        it('Should find user by id.', async function(){
            this.timeout(6000);

            const result = await usersControllers.findById('1548617028320u');

            assert.isObject(result);
        });
    });

    describe('Domains Controllers', function(){
        it('Should Find Domain', function(done){
            this.timeout(6000);

            domainsController.findDomainByName('amigo_secreto', (error, result) => {
                assert.isNull(error);
                done();
            });
        });
    });

    describe('Games Controllers', function(){
        
        it('Should Find Game by domain', function(done){
            this.timeout(10000);

            gamesController.findGameByDomainId('amigo_secreto', (error, result) => {
                assert.isNull(error);
                done();
            });
        });

        it('Should organize pairs', function(done){
            this.timeout(6000);

            gamesController.playGame('amigo_secreto', (error, result) => {
                assert.isNull(error);
                done();
            });
        });

        it('Should send email', async function(){
            this.timeout(10000);

            let result = await gamesController.asyncSendEmails(['1548617028320u', '1548715130582u']);

            assert.isTrue(result);
        });
    });
});