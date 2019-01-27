let assert = require('chai').assert;
let usersControllers = require('../src/controllers/usersController');
let domainsController = require('../src/controllers/domainsController');
let gamesController = require('../src/controllers/gamesController');

describe('Routes', function(){
    describe('Users Controllers', function(){
        it('Controler should be an Object.', function(){
            assert.isObject(usersControllers);
        });
        it('Controller.users should be a Function.', function(){
            assert.isFunction(usersControllers.users);
        });
        it('Should find the user.', function(done){
            this.timeout(6000);

            usersControllers.findByEmailAndPassword({ email: 'zscaio.si@gmail.com', password: '12839081309' }, function(error, result){
                assert.isNull(error);
                assert.isString(result.token);
                done();
            });
        });
        it('Should fetch users from domain.', function(done){
            this.timeout(6000);

            usersControllers.fetchByDomain('7Grupo 1', function(error, result){
                assert.isNull(error);
                done();
            });
        });
        // Stop creating users on tests
        // it('Should create a user.', function(done){
        //     this.timeout(6000);

        //     usersControllers.createUser({ email: 'zscaio.si@test.com', password: '12839081309', name: 'Caio Saldanha', domains: ['7Grupo 1'] }, function(error, result){
        //         assert.isNull(error);
        //         done();
        //     });
        // });
    });

    describe('Domains Controllers', function(){
        // it('Should Create Domain', function(done){
        //     this.timeout(6000);

        //     domainsController.createDomain({ name: 'Grupo 21', finishDate: new Date('2019-12-25') }, (error, result) => {
        //         assert.isNull(error);
        //         done();
        //     });
        // });
        it('Should Find Domain', function(done){
            this.timeout(6000);

            domainsController.findDomainByName('Grupo 1', (error, result) => {
                console.log(result)
                assert.isNull(error);
                done();
            });
        });
    });

    describe('Games Controllers', function(){
        
        // it('Shuld Create Game', function(done){
        //     this.timeout(10000);

        //     gamesController.createGame({ subscribers: [], domainId: '7Grupo 7' }, (error, result) => {
        //         assert.isNull(error);
        //         done();
        //     });
        // });
        it('Shuld Find Game by domain', function(done){
            this.timeout(10000);

            gamesController.findGameByDomainId('7Grupo 7', (error, result) => {
                assert.isNull(error);
                done();
            });
        });
    });
});