module.exports = function(invariant) {
  return function ({
      appointmentId,
      entityName}) {
    
    invariant(appointmentId, `Cancel appointment requires that you pass the AppointmentId`);
    invariant(entityName, `Cancel appointment requires that you pass the 
      enitityName since it's a date but the date prop is utc` );
    return {
      appointmentId,
      entityName};
  }
};