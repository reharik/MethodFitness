// import React from 'react';
// import {reduxForm} from 'redux-form';
// import {createTaskSubmitHandler, removeTaskHandler} from './../actions/calendarActions'
// import TaskForm from './TaskForm';
// import formJsonSchema from './../model/formJsonSchema';
// import schema from './../model/taskModel.json';
//
// // const fjs = formJsonSchema(schema);
//
// const mapStateToProps = state => {
//   var task = state.calendarTasks.find(x=>x.id === state.taskInProcess.id) || state.taskInProcess;
//   var newTask = {...task};
//     newTask.startTime = newTask.startTime ? newTask.startTime.format('h:mm A') : undefined;
//     newTask.endTime = newTask.endTime ? newTask.endTime.format('h:mm A') : undefined;
//     newTask.date = state.taskInProcess.date;
//   return {
//     initialValues: newTask
//   }
// };
//
// const TaskFormContainer = reduxForm({
//   form: 'task',
//   // fields: fjs.fields,
//   // validate: fjs.validate,
//   onSubmit: createTaskSubmitHandler,
//   onRemove: removeTaskHandler
// }, mapStateToProps)(TaskForm);
//
// export default TaskFormContainer
