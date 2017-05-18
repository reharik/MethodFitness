import React, {Component} from 'react';
import SubmissionFor from '../../../containers/forms/SubmissionForContainer';
import DisplayFor from './DisplayFor'

const EditableFor = (props) => {
  if (props.editing) {
    return <SubmissionFor {...props} />
  }
  if(props.noDisplay){
    return null;
  }
  return <DisplayFor {...props}/>
};

export default EditableFor;




