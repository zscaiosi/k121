let assert = require('chai').assert;
let usersControllers = require('../src/controllers/usersController');

describe('Routes', function(){
    describe('Users Controllers', function(){
        it('Controler should be an Object.', function(){
            assert.isObject(usersControllers);
        });
        it('Controller.users should be a Function.', function(){
            assert.isFunction(usersControllers.users);
        });
    });
});