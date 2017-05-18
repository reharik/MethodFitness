// import React, { Component, PropTypes } from 'react'
//
// let TaskForm =class TaskForm extends Component {
//   render() {
//     const {fields: {id, startTime, endTime, display, color}, handleSubmit, submitting, onRemove, dispatch} = this.props
//     return (<div className="taskForm__container">
//         <form onSubmit={handleSubmit} className="taskForm">
//           <div className="taskForm__input">
//             <label className="taskForm__input__label">Start Time</label>
//             <input className="taskForm__input__text" type="text" placeholder="Start Time" {...startTime}/>
//             {startTime.touched && startTime.error && <div>{startTime.error}</div>}
//           </div>
//           <div className="taskForm__input">
//             <label className="taskForm__input__label">End Time</label>
//             <input className="taskForm__input__text" type="text" placeholder="End Time" {...endTime}/>
//             {endTime.touched && endTime.error && <div>{endTime.error}</div>}
//           </div>
//           <div className="taskForm__input">
//             <label className="taskForm__input__label">Display</label>
//             <input className="taskForm__input__text" type="text" placeholder="Display" {...display}/>
//             {display.touched && display.error && <div>{display.error}</div>}
//           </div>
//           <div className="taskForm__input">
//             <label className="taskForm__input__label">Color</label>
//             <input className="taskForm__input__text" type="text" placeholder="Color" {...color}/>
//             {color.touched && color.error && <div>{color.error}</div>}
//           </div>
//           <input type="hidden" {...id} />
//           <div className="taskForm__input">
//             <button className="taskForm__input__button" type="submit"
//                     disabled={submitting}>{id.value ? 'update' : 'submit'}</button>
//             {id.value ? <button className="taskForm__input__button" type="button" disabled={submitting}
//                                 onClick={e=>onRemove(id.value, dispatch)}>delete</button> : null}
//           </div>
//         </form>
//       </div>
//     );
//   }
// }
//
// export default TaskForm
