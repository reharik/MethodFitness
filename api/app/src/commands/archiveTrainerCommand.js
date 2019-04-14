module.exports = function(invariant) {
  return function({ trainerId, date,
                    createdDate,
                    createdById
                  }) {
    invariant(
      trainerId,
      'archiveTrainer requires that you pass the trainerss id',
    );
    invariant(date, 'archiveTrainer requires that you pass the archived date');
    return { trainerId, date,
      createdDate,
      createdById
    };
  };
};
