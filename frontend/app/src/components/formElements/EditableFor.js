import React from 'react';
import PropTypes from 'prop-types';
import SubmissionFor from './SubmissionFor';
import DisplayFor from './DisplayFor';
import HiddenFor from './HiddenFor';

const EditableFor = props => {
  if(props.hidden) {
    return <HiddenFor {...props} />;
  }
  if (props.editing) {
    return <SubmissionFor {...props} />;
  }
  if (props.noDisplay) {
    return null;
  }
  return <DisplayFor {...props} />;
};

EditableFor.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  displayStyle: PropTypes.string,
  selectOptions: PropTypes.array,
  noDisplay: PropTypes.string,
  hidden: PropTypes.bool,
  editing: PropTypes.bool
};

export default EditableFor;
