import React from 'react';
import PropTypes from 'prop-types';

const EDFooter = ({ editing, toggleEdit }) => {
  return (
    <div className="editableDisplay__footer">
      {editing
        ? <div>
          <button type="submit" className="editableDisplay__footer__button"> Submit</button>
          <button onClick={e => toggleEdit(e, true)}>Cancel</button>
        </div>
        : <a className="editableDisplay__footer_edit" onClick={e => toggleEdit(e, false)}>edit</a>}
    </div>
  );
};

EDFooter.propTypes = {
  editing: PropTypes.bool,
  toggleEdit: PropTypes.func
};

export default EDFooter;
