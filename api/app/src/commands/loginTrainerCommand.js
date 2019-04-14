/**
 * Created by reharik on 7/26/15.
 */


module.exports = function(invariant) {
  return function(trainerId, userName,
                  createdDate,
                  createdById
  ) {
    invariant(trainerId, 'loginTrainer requires that you pass the trainers Id');
    invariant(userName, 'loginTrainer requires that you pass the trainers userName');
    return { trainerId, userName,
      createdDate,
      createdById
    };
  };
};
