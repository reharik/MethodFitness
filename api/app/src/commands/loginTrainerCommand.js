/**
 * Created by reharik on 7/26/15.
 */
"use strict";

module.exports = function(invariant){
    return function(id, userName){
        invariant(id, 'loginTrainer requires that you pass the trainers Id');
        invariant(userName, 'loginTrainer requires that you pass the trainers userName');
        return {id, userName};
    }
};