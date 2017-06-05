import React from 'react';
import PropTypes from 'prop-types';
import SubmissionFor from '../../../containers/forms/SubmissionForContainer';
import DisplayFor from './DisplayFor';

const EditableFor = props => {
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
  noDisplay: PropTypes.bool,
  editing: PropTypes.bool
};

export default EditableFor;
